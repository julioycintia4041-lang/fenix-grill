"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import * as THREE from "three";

const FRAME_COUNT = 234;
const IMAGE_ASPECT = 1280 / 720;
const FOCUS_X = 0.51;
const LOAD_CONCURRENCY = 6;
const CORE_FRAMES = 36;
const TEXTURE_RADIUS = 6;
const REVEAL_TIMEOUT_MS = 10000;

const frameSrc = (index: number) =>
  `/frames/fenix-frame-${String(index + 1).padStart(3, "0")}.jpg`;

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uTexA;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  uniform float uFocusX;
  uniform float uDesplazamiento; // desplazamiento UV hacia la derecha para ocultar muro blanco

  vec2 coverUv(vec2 uv) {
    float screenAspect = uResolution.x / max(uResolution.y, 1.0);
    float sx = 1.0;
    float sy = 1.0;

    if (screenAspect > uImageAspect) {
      sy = uImageAspect / screenAspect;
    } else {
      sx = screenAspect / uImageAspect;
    }

    float ox = (1.0 - sx) * uFocusX;
    float oy = (1.0 - sy) * 0.5;

    // Desplazar la ventana hacia la derecha y aplicar zoom para llenar la pantalla sin deformar proporción
    if (uDesplazamiento > 0.0) {
      float newSx = max(0.001, sx - uDesplazamiento);
      float zoom = sx / newSx;
      float newSy = sy / zoom;
      float newOx = ox + uDesplazamiento;
      float newOy = (1.0 - newSy) * 0.5;
      return vec2(newOx + uv.x * newSx, newOy + uv.y * newSy);
    }

    return vec2(ox + uv.x * sx, oy + uv.y * sy);
  }

  void main() {
    vec2 uv = coverUv(vUv);
    // Los ImageBitmap se suben sin voltear: se invierte V aquí.
    uv.y = 1.0 - uv.y;

    gl_FragColor = vec4(texture2D(uTexA, uv).rgb, 1.0);
  }
`;

/** Orden de precarga: primero una pasada gruesa por todo el recorrido y luego se rellena. */
function buildLoadOrder(total: number) {
  const order: number[] = [];
  const seen = new Set<number>();

  for (const stride of [16, 8, 4, 2, 1]) {
    for (let index = 0; index < total; index += stride) {
      if (!seen.has(index)) {
        seen.add(index);
        order.push(index);
      }
    }
  }

  return order;
}

type TextureEntry = { texture: THREE.Texture; bitmap: ImageBitmap };

export default function ScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);

  // Reveal de los bloques marcador
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Canvas fijo con la secuencia de frames
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const probe = document.createElement("canvas");
    const context =
      probe.getContext("webgl2") ?? probe.getContext("webgl");

    if (!context || typeof createImageBitmap !== "function") {
      setFallback(true);
      setReady(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      setFallback(true);
      setReady(true);
      return;
    }

    const maxPixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(maxPixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x050505, 1);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const placeholder = new THREE.DataTexture(
      new Uint8Array([5, 5, 5, 255]),
      1,
      1,
    );
    placeholder.needsUpdate = true;

    // Tabla de borde derecho del muro blanco (px sobre 1280 de ancho, índice 0-based = frame - 1)
    // Medidas de Anny: frame 130→0, 140→205, 145→230, 150→200, 155→166, 170→105, 180→64, 185→25, 190→0
    // Convertidas a índice 0-based (frame N → index N-1)
    const WHITE_WALL_KEYFRAMES: Array<[number, number]> = [
      [129, 0],
      [139, 205],
      [144, 230],
      [149, 200],
      [154, 166],
      [169, 105],
      [179, 64],
      [184, 25],
      [189, 0],
    ];

    /** Interpola linealmente la posición del borde derecho del muro blanco (px) en el índice dado. */
    const whiteWallBorderPx = (index: number): number => {
      if (index <= WHITE_WALL_KEYFRAMES[0][0]) return 0;
      if (index >= WHITE_WALL_KEYFRAMES[WHITE_WALL_KEYFRAMES.length - 1][0]) return 0;
      for (let i = 1; i < WHITE_WALL_KEYFRAMES.length; i++) {
        const [x0, y0] = WHITE_WALL_KEYFRAMES[i - 1];
        const [x1, y1] = WHITE_WALL_KEYFRAMES[i];
        if (index >= x0 && index <= x1) {
          const t = (index - x0) / (x1 - x0);
          return y0 + t * (y1 - y0);
        }
      }
      return 0;
    };

    /** Calcula el desplazamiento UV (0–1) necesario para ocultar el muro blanco
     *  dado el índice de frame actual y la resolución actual del viewport. */
    const computeDesplazamiento = (index: number, vpWidth: number, vpHeight: number): number => {
      const borderPx = whiteWallBorderPx(index);
      if (borderPx <= 0) return 0;

      const SAFETY_PX = 20;
      const borderUv = (borderPx + SAFETY_PX) / 1280;

      const screenAspect = vpWidth / Math.max(vpHeight, 1);
      const anchoVisible = Math.min(1.0, screenAspect / IMAGE_ASPECT);
      const izquierdaVisible = FOCUS_X - anchoVisible / 2;

      // Si el muro ya queda fuera del encuadre izquierdo, no hace falta desplazar.
      return Math.max(0, borderUv - izquierdaVisible);
    };

    const uniforms = {
      uTexA: { value: placeholder as THREE.Texture },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uImageAspect: { value: IMAGE_ASPECT },
      uFocusX: { value: FOCUS_X },
      uDesplazamiento: { value: 0.0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const blobs: Array<Blob | null> = new Array(FRAME_COUNT).fill(null);
    const textures = new Map<number, TextureEntry>();
    const pending = new Set<number>();

    let cancelled = false;
    let coreReady = false;
    let loadedCount = 0;

    const maybeReveal = () => {
      if (coreReady) return;
      if (
        (loadedCount >= CORE_FRAMES || loadedCount === FRAME_COUNT) &&
        textures.has(0)
      ) {
        coreReady = true;
        setReady(true);
      }
    };

    const ensureTexture = async (index: number) => {
      if (index < 0 || index >= FRAME_COUNT) return;
      if (textures.has(index) || pending.has(index)) return;

      const blob = blobs[index];
      if (!blob) return;

      pending.add(index);
      try {
        const bitmap = await createImageBitmap(blob);
        if (cancelled) {
          bitmap.close();
          return;
        }

        const texture = new THREE.Texture(bitmap);
        texture.flipY = false;
        texture.colorSpace = THREE.NoColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;

        textures.set(index, { texture, bitmap });
        maybeReveal();
      } catch {
        // Si un frame no decodifica se mantiene el más cercano ya cargado.
      } finally {
        pending.delete(index);
      }
    };

    const trimTextures = (around: number) => {
      textures.forEach((entry, index) => {
        if (Math.abs(index - around) > TEXTURE_RADIUS + 4) {
          entry.texture.dispose();
          entry.bitmap.close();
          textures.delete(index);
        }
      });
    };

    const prefetchTextures = (around: number) => {
      const from = Math.max(0, Math.floor(around) - 2);
      const to = Math.min(FRAME_COUNT - 1, Math.floor(around) + TEXTURE_RADIUS);

      for (let index = from; index <= to; index += 1) {
        void ensureTexture(index);
      }
    };

    const nearestTexture = (index: number): TextureEntry | null => {
      for (let distance = 0; distance < FRAME_COUNT; distance += 1) {
        const lower = index - distance;
        const upper = index + distance;
        const lowerEntry = lower >= 0 ? textures.get(lower) : undefined;
        if (lowerEntry) return lowerEntry;
        const upperEntry = upper < FRAME_COUNT ? textures.get(upper) : undefined;
        if (upperEntry) return upperEntry;
      }
      return null;
    };

    // Resize al viewport
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(maxPixelRatio());
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    // Scroll suave (rueda, teclado nativo y táctil nativo)
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    // Precarga progresiva en orden repartido por todo el recorrido
    const controller = new AbortController();
    const loadOrder = buildLoadOrder(FRAME_COUNT);
    let cursor = 0;
    let progressRaf = 0;

    const reportProgress = () => {
      if (progressRaf) return;
      progressRaf = requestAnimationFrame(() => {
        progressRaf = 0;
        setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
      });
    };

    const loadWorker = async () => {
      while (!cancelled && cursor < loadOrder.length) {
        const index = loadOrder[cursor];
        cursor += 1;

        try {
          const response = await fetch(frameSrc(index), {
            signal: controller.signal,
            cache: "force-cache",
          });

          if (!response.ok) throw new Error(`Frame ${index}`);

          const blob = await response.blob();
          if (cancelled) return;

          blobs[index] = blob;
          loadedCount += 1;
          reportProgress();

          if (index === 0) void ensureTexture(0);
          maybeReveal();
        } catch {
          // Un frame fallido no detiene la carga del resto.
        }
      }
    };

    for (let worker = 0; worker < LOAD_CONCURRENCY; worker += 1) {
      void loadWorker();
    }

    const revealTimeout = window.setTimeout(() => {
      if (coreReady) return;
      coreReady = true;
      setReady(true);
    }, REVEAL_TIMEOUT_MS);

    // Animación
    let smoothIndex = 0;
    let previousTime = performance.now();
    let animationFrame = 0;

    const tick = (time: number) => {
      animationFrame = requestAnimationFrame(tick);
      lenis.raf(time);

      const delta = Math.min(Math.max(time - previousTime, 0), 100) / 1000;
      previousTime = time;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const scrollTop = Math.min(Math.max(lenis.scroll, 0), maxScroll);
      const scrollProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;

      const targetIndex = scrollProgress * (FRAME_COUNT - 1);

      smoothIndex += (targetIndex - smoothIndex) * (1 - Math.exp(-12 * delta));
      if (Math.abs(targetIndex - smoothIndex) < 0.002) {
        smoothIndex = targetIndex;
      }

      // Un único frame entero, el más cercano: sin mezcla entre texturas.
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(smoothIndex)),
      );
      const entry = textures.get(frameIndex) ?? nearestTexture(frameIndex);
      uniforms.uTexA.value = entry?.texture ?? placeholder;

      // Desplazamiento UV para ocultar el muro blanco en los frames 130–190 (en escritorio).
      uniforms.uDesplazamiento.value = computeDesplazamiento(
        smoothIndex,
        uniforms.uResolution.value.x,
        uniforms.uResolution.value.y,
      );

      renderer.render(scene, camera);

      prefetchTextures(frameIndex);
      trimTextures(frameIndex);
    };

    animationFrame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      controller.abort();
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(progressRaf);
      window.clearTimeout(revealTimeout);

      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);

      lenis.destroy();

      textures.forEach((entry) => {
        entry.texture.dispose();
        entry.bitmap.close();
      });
      textures.clear();

      placeholder.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {fallback ? (
        // Respaldo sin WebGL: primer frame estático
        <img
          src={frameSrc(0)}
          alt=""
          aria-hidden="true"
          className="fixed inset-0 z-0 h-full w-full object-cover"
          style={{ objectPosition: `${FOCUS_X * 100}% 50%` }}
        />
      ) : null}

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`fixed inset-0 z-0 h-full w-full ${fallback ? "hidden" : ""}`}
      />

      <div
        aria-hidden={ready}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#050505] transition-opacity duration-700 ${
          ready ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/45">
          Cargando recorrido
        </p>
        <div className="h-px w-56 overflow-hidden bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#3b82f6] to-[#ff5a2b] transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-3xl font-light tabular-nums text-white">
          {progress}%
        </span>
      </div>
    </>
  );
}

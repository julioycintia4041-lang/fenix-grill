"use client";

import { Flame, MapPin, ChevronDown, ArrowRight } from "lucide-react";
import { RESTAURANT_INFO } from "@/data/menu";

interface HeroBannerProps {
  onExploreClick: () => void;
}

export default function HeroBanner({ onExploreClick }: HeroBannerProps) {
  return (
    <section className="relative min-h-[92svh] flex flex-col items-center justify-center px-4 sm:px-6 pt-32 sm:pt-40 pb-16 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Badge de bienvenida */}
        <div className="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 border border-white/20 shadow-xl backdrop-blur-xl">
          <Flame className="w-4 h-4 text-[#ff5a2b] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/95">
            {RESTAURANT_INFO.slogan}
          </span>
        </div>

        {/* Scrim oscuro detrás del título y subtítulo para contraste absoluto sobre la fachada del video */}
        <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-black/80 via-black/70 to-black/85 backdrop-blur-md border border-white/15 shadow-2xl shadow-black/80 space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            Fénix{" "}
            <span className="bg-gradient-to-r from-[#ff3b00] via-[#ff5a2b] to-[#0066ff] bg-clip-text text-transparent">
              Grill Bar
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Auténticas especialidades a la parrilla, hamburguesas premium y almuerzos completos en el corazón de San Cristóbal.
          </p>
        </div>

        {/* Ubicación */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/90 bg-black/60 border border-white/15 px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
          <MapPin className="w-4 h-4 text-[#ff5a2b] shrink-0" />
          <span>{RESTAURANT_INFO.address}</span>
        </div>

        {/* CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-fenix-gradient hover:opacity-95 text-white font-extrabold px-8 py-3.5 text-xs uppercase tracking-wider transition-all active:scale-95 shadow-xl shadow-orange-950/50 cursor-pointer"
          >
            <span>Explorar Carta Digital</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/60 text-[10px] uppercase tracking-widest pointer-events-none animate-bounce">
        <span>Desliza para recorrer el restaurante</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}

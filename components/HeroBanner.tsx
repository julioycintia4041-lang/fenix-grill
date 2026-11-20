"use client";

import { Flame, MapPin, ChevronDown } from "lucide-react";
import { RESTAURANT_INFO } from "@/data/menu";

interface HeroBannerProps {
  onExploreClick?: () => void;
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

        {/* Tarjeta Liquid Glass más ligera (translúcida) con textos nítidos */}
        <div className="relative p-6 sm:p-10 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/60 space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
            Fénix{" "}
            <span className="bg-gradient-to-r from-[#ff3b00] via-[#ff5a2b] to-[#0066ff] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              Grill Bar
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white max-w-xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            Auténticas especialidades a la parrilla, hamburguesas premium y almuerzos completos en el corazón de San Cristóbal.
          </p>
        </div>

        {/* Ubicación */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/95 bg-black/40 border border-white/15 px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
          <MapPin className="w-4 h-4 text-[#ff5a2b] shrink-0" />
          <span>{RESTAURANT_INFO.address}</span>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/70 text-[10px] uppercase tracking-widest pointer-events-none animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span>Desliza para recorrer el restaurante</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}

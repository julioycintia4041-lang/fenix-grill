"use client";

import { Flame, MapPin, MessageCircle, Globe, Phone } from "lucide-react";
import { RESTAURANT_INFO, WHATSAPP_NUMBER } from "@/data/menu";

export default function FooterInfo() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/85 backdrop-blur-xl py-12 px-4 sm:px-6 mt-16 text-white/80">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Identidad */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff3b00] to-[#0066ff] flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-white uppercase tracking-wider">
              {RESTAURANT_INFO.name}
            </span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed max-w-sm">
            {RESTAURANT_INFO.slogan}. Disfruta la mejor experiencia a la parrilla, carnes seleccionadas, cortes tiernos y el mejor ambiente.
          </p>
        </div>

        {/* Ubicación y Contacto */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider mb-2">
            Visítanos
          </h4>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#ff5a2b] shrink-0 mt-0.5" />
            <span>{RESTAURANT_INFO.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#0066ff] shrink-0" />
            <span>WhatsApp: {RESTAURANT_INFO.whatsapp_display}</span>
          </div>
        </div>

        {/* Canales Digitales */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider">
            Pedidos y Redes
          </h4>
          <p className="text-white/60">
            Realiza tu pedido digital y lo recibimos al instante en cocina vía WhatsApp.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://wa.me/584227347307"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-colors font-bold text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Directo</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40">
        <p>© {new Date().getFullYear()} {RESTAURANT_INFO.name}. Todos los derechos reservados.</p>
        <p>Carta Digital Demo con Scroll-Motion • San Cristóbal, Venezuela</p>
      </div>
    </footer>
  );
}

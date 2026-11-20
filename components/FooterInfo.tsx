"use client";

import { Flame, MapPin, MessageCircle, Globe, Phone } from "lucide-react";
import { RESTAURANT_INFO, WHATSAPP_NUMBER } from "@/data/menu";

export default function FooterInfo() {
  return (
    <footer className="relative z-10 border-t border-white/20 bg-black/40 backdrop-blur-xl py-12 px-4 sm:px-6 mt-16 text-white shadow-2xl shadow-black/60">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Identidad */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff3b00] to-[#0066ff] flex items-center justify-center shadow-md">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-white uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              {RESTAURANT_INFO.name}
            </span>
          </div>
          <p className="text-xs text-white/90 leading-relaxed max-w-sm font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
            {RESTAURANT_INFO.slogan}. Disfruta la mejor experiencia a la parrilla, carnes seleccionadas, cortes tiernos y el mejor ambiente.
          </p>
        </div>

        {/* Ubicación y Contacto */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            Visítanos
          </h4>
          <div className="flex items-start gap-2 text-white/95 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
            <MapPin className="w-4 h-4 text-[#ff5a2b] shrink-0 mt-0.5" />
            <span>{RESTAURANT_INFO.address}</span>
          </div>
          <div className="flex items-center gap-2 text-white/95 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
            <Phone className="w-4 h-4 text-[#0066ff] shrink-0" />
            <span>WhatsApp: {RESTAURANT_INFO.whatsapp_display}</span>
          </div>
        </div>

        {/* Canales Digitales */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            Pedidos y Redes
          </h4>
          <p className="text-white/90 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
            Realiza tu pedido digital y lo recibimos al instante en cocina vía WhatsApp.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://wa.me/584227347307"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-colors font-bold text-xs shadow-lg shadow-black/40 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Directo</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/75 text-center md:text-left">
        <p className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          © {new Date().getFullYear()} {RESTAURANT_INFO.name}. Todos los derechos reservados.
        </p>
        <p className="font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          Diseño y desarrollo web:{" "}
          <a
            href="https://portafolio.nexomarketingdigital.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#ff5a2b] font-bold underline underline-offset-4 decoration-white/40 hover:decoration-[#ff5a2b] transition-colors inline-block"
          >
            Nexo Digital Agency Pro
          </a>
        </p>
        <p className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          Carta Digital Demo con Scroll-Motion • San Cristóbal, Venezuela
        </p>
      </div>
    </footer>
  );
}

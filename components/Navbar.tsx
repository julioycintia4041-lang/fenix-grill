"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Flame,
  ShoppingBag,
  Menu as MenuIcon,
  X,
  ChevronDown,
  Beef,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";
import { FENIX_MENU_CATEGORIES, RESTAURANT_INFO } from "@/data/menu";

interface NavbarProps {
  activeCategory: string; // "hamburguesas" | "parrillas" | "almuerzos"
  cartCount: number;
  onOpenCart: () => void;
  onNavigateToCategory: (slug: string) => void;
}

export default function Navbar({
  activeCategory,
  cartCount,
  onOpenCart,
  onNavigateToCategory,
}: NavbarProps) {
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const handleSelectCategory = (slug: string) => {
    setIsExploreOpen(false);
    onNavigateToCategory(slug);
  };

  const getCategoryIcon = (id: number) => {
    if (id === 1) return <Flame className="w-4 h-4 text-[#ff5a2b]" />;
    if (id === 2) return <Beef className="w-4 h-4 text-[#ff3b00]" />;
    return <UtensilsCrossed className="w-4 h-4 text-[#0066ff]" />;
  };

  return (
    <>
      <header
        data-fenix-navbar="true"
        className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-3 transition-all"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 liquid-glass-bar rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 border border-white/15">
          {/* Logo y Nombre */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#ff3b00] to-[#0066ff] p-0.5 flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <Flame className="w-4 h-4 text-[#ff5a2b]" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase block leading-none">
                Fénix Grill
              </span>
              <span className="text-[10px] text-white/50 tracking-widest uppercase hidden sm:block">
                Donde el sabor renace
              </span>
            </div>
          </div>

          {/* Botón EXPLORAR EL MENÚ y Píldoras con Scroll-Spy (Desktop) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón Explorar el Menú */}
            <div className="relative">
              <button
                type="button"
                data-explore-menu-btn="true"
                onClick={() => setIsExploreOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isExploreOpen
                    ? "bg-fenix-gradient text-white shadow-lg shadow-orange-950/40"
                    : "liquid-glass hover:bg-white/10 text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xs:inline">Explorar el Menú</span>
                <span className="xs:hidden">Menú</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isExploreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Panel desplegable de EXPLORAR EL MENÚ */}
              {isExploreOpen && (
                <div
                  data-explore-menu-panel="true"
                  className="absolute top-full left-0 mt-2 w-72 sm:w-80 rounded-2xl liquid-glass border border-white/20 p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150 bg-[#0d0f18]/95"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 py-1 mb-1">
                    Categorías de la Carta
                  </div>
                  <div className="space-y-1.5">
                    {FENIX_MENU_CATEGORIES.map((cat) => {
                      const isActive = activeCategory === cat.slug;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleSelectCategory(cat.slug)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isActive
                              ? "bg-white/15 border border-[#ff5a2b]/60 text-white"
                              : "hover:bg-white/5 text-white/80 hover:text-white border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="p-1.5 rounded-lg bg-black/40 border border-white/10">
                              {getCategoryIcon(cat.id)}
                            </span>
                            <div>
                              <span className="text-xs font-bold block">
                                {cat.name}
                              </span>
                              <span className="text-[10px] text-white/50">
                                {cat.items.length}{" "}
                                {cat.items.length === 1 ? "opción" : "especialidades"}
                              </span>
                            </div>
                          </div>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#ff5a2b] shadow-[0_0_8px_#ff5a2b]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Píldoras con Scroll-Spy (visibles en desktop/tablet) */}
            <nav className="hidden md:flex items-center gap-1.5 liquid-glass rounded-full p-1 border border-white/10">
              {FENIX_MENU_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    data-pill-slug={cat.slug}
                    onClick={() => onNavigateToCategory(cat.slug)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "liquid-glass-pill-active text-white font-bold"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {cat.name.replace(" a la Parrilla", "").replace("Especial de ", "")}
                  </button>
                );
              })}
            </nav>

            {/* Botón Carrito */}
            <button
              type="button"
              data-cart-button="true"
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fenix-fire hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-950/40 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Pedido</span>
              {cartCount > 0 && (
                <span
                  data-cart-badge="true"
                  className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[11px] flex items-center justify-center shrink-0 animate-in zoom-in"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop para cerrar panel de explorar al hacer click afuera */}
      {isExploreOpen && (
        <div
          className="fixed inset-0 z-35 bg-transparent"
          onClick={() => setIsExploreOpen(false)}
        />
      )}
    </>
  );
}

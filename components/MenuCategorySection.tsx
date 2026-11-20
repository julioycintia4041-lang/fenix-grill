"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Flame, Beef, UtensilsCrossed } from "lucide-react";
import { MenuCategory, MenuItem } from "@/data/menu";
import MenuProductCard from "./MenuProductCard";

interface MenuCategorySectionProps {
  category: MenuCategory;
  onOpenModal: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export default function MenuCategorySection({
  category,
  onOpenModal,
  onQuickAdd,
}: MenuCategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const amount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const getCategoryIcon = () => {
    if (category.id === 1) return <Flame className="w-6 h-6 text-[#ff5a2b]" />;
    if (category.id === 2) return <Beef className="w-6 h-6 text-[#ff3b00]" />;
    return <UtensilsCrossed className="w-6 h-6 text-[#0066ff]" />;
  };

  const getCategoryBadge = () => {
    if (category.id === 1) return "10 Especialidades a la parrilla";
    if (category.id === 2) return "3 Cortes para compartir";
    return "7 Proteínas • 3 Acompañantes";
  };

  return (
    <section
      id={category.slug}
      data-category-slug={category.slug}
      data-category-id={category.id}
      className="scroll-mt-28 py-10 sm:py-14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Bloque de encabezado con el mismo liquid glass ligero que la tarjeta del héroe (Prompt 2d) */}
          <div className="inline-block p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/60 max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/10 border border-white/10">
                {getCategoryIcon()}
              </span>
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#ff5a2b] drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
                {getCategoryBadge()}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
              {category.name}
            </h2>
            <p className="text-xs sm:text-sm text-white font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,1)] leading-relaxed">
              {category.id === 1 && "Recetas artesanales al carbón con los mejores cortes y vegetales frescos."}
              {category.id === 2 && "Selección de carnes tiernas a las brasas, acompañadas con papas o yuca."}
              {category.id === 3 && "Almuerzo completo preparado al momento con 7 opciones de proteína."}
            </p>
          </div>

          {/* Botones de navegación del carrusel en escritorio */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              aria-label={`Desplazar hacia la izquierda en ${category.name}`}
              onClick={() => scroll("left")}
              className="p-2.5 rounded-full liquid-glass hover:bg-white/10 transition-colors text-white active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label={`Desplazar hacia la derecha en ${category.name}`}
              onClick={() => scroll("right")}
              className="p-2.5 rounded-full liquid-glass hover:bg-white/10 transition-colors text-white active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carrusel horizontal */}
      <div
        ref={scrollContainerRef}
        tabIndex={0}
        aria-label={`Carrusel de ${category.name}`}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 sm:px-6 max-w-7xl mx-auto pb-4 pt-1 focus:outline-none"
      >
        {category.items.map((item) => (
          <MenuProductCard
            key={item.id}
            item={item}
            onOpenModal={onOpenModal}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </section>
  );
}

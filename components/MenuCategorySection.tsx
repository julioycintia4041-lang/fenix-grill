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
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                {getCategoryIcon()}
              </span>
              <span className="text-xs uppercase tracking-widest font-bold text-[#ff5a2b]">
                {getCategoryBadge()}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight glass-text">
              {category.name}
            </h2>
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

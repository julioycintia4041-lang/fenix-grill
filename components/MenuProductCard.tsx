"use client";

import Image from "next/image";
import { Plus, SlidersHorizontal } from "lucide-react";
import { MenuItem } from "@/data/menu";

interface MenuProductCardProps {
  item: MenuItem;
  onOpenModal: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export default function MenuProductCard({
  item,
  onOpenModal,
  onQuickAdd,
}: MenuProductCardProps) {
  return (
    <article
      data-item-id={item.id}
      data-category-id={item.categoryId}
      onClick={() => onOpenModal(item)}
      className="group snap-start shrink-0 self-stretch w-[82vw] max-w-[300px] sm:max-w-none sm:w-[340px] md:w-[380px] lg:w-[400px] rounded-2xl liquid-glass-card overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Marco fijo 4:3 para foto protagonista recortada sobre vidrio líquido */}
      <div
        data-card-photo-frame="true"
        className="relative w-full aspect-[4/3] shrink-0 overflow-hidden bg-gradient-to-b from-white/5 via-transparent to-black/40 p-4 sm:p-5"
      >
        <div className="relative h-full w-full">
          <Image
            src={item.photo}
            alt={item.name}
            fill
            sizes="(max-width: 639px) 280px, (max-width: 767px) 340px, (max-width: 1023px) 380px, 400px"
            className="object-contain object-center select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] group-hover:scale-105 transition-transform duration-300"
            draggable={false}
          />
        </div>

        {/* Badge de categoría / opciones */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.categoryId === 1 && (
            <span className="rounded-full bg-blue-500/20 border border-blue-400/40 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 tracking-wider uppercase backdrop-blur-md">
              Hamburguesa
            </span>
          )}
          {item.categoryId === 2 && (
            <span className="rounded-full bg-orange-500/20 border border-orange-400/40 px-2.5 py-0.5 text-[10px] font-bold text-orange-300 tracking-wider uppercase backdrop-blur-md">
              Parrilla
            </span>
          )}
          {item.categoryId === 3 && (
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 tracking-wider uppercase backdrop-blur-md">
              Almuerzo Completo
            </span>
          )}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-gradient-to-b from-black/50 via-black/75 to-black/90">
        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#ff5a2b] transition-colors leading-tight glass-text">
          {item.name}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed glass-text">
          {item.desc}
        </p>

        {/* Lista fija de incluidos para el Almuerzo */}
        {item.includedItems && item.includedItems.length > 0 && (
          <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#ff5a2b] tracking-wider block">
              Incluye:
            </span>
            <ul className="text-[11px] text-white/90 space-y-0.5 list-disc list-inside">
              {item.includedItems.map((inc, i) => (
                <li key={i}>{inc}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Indicador de opciones si aplica */}
        {item.hasOptions && item.categoryId === 2 && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a2b]" />
            <span>Acompañante a elección (Papas fritas o Yuca)</span>
          </div>
        )}
        {item.hasOptions && item.categoryId === 3 && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            <span>7 Proteínas a elección • 3 Acompañantes</span>
          </div>
        )}

        {/* Pie de tarjeta anclado abajo: SIN precio (DEMO) */}
        <div data-card-footer="true" className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          {/* Si el precio no es null en el futuro, se muestra aquí */}
          {item.price !== null ? (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-white/70">Precio</span>
              <span className="text-lg font-bold text-[#ff5a2b]">${item.price}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-white/50">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Disponible</span>
            </div>
          )}

          {item.hasOptions ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(item);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-fenix-fire hover:opacity-95 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-950/40 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Personalizar +</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(item);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-fenix-blue hover:opacity-95 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-blue-950/40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Agregar</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, X, Check } from "lucide-react";
import { MenuItem } from "@/data/menu";

interface ProductModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    selectedProtein?: string,
    selectedSide?: string,
    notes?: string
  ) => void;
}

export default function ProductModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedProtein, setSelectedProtein] = useState<string>("");
  const [selectedSide, setSelectedSide] = useState<string>("");
  const [notes, setNotes] = useState("");

  // Inicializar o resetear cuando cambia el plato
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setNotes("");
      if (item.proteins && item.proteins.length > 0) {
        setSelectedProtein(item.proteins[0]);
      } else {
        setSelectedProtein("");
      }
      if (item.sides && item.sides.length > 0) {
        setSelectedSide(item.sides[0]);
      } else {
        setSelectedSide("");
      }
    }
  }, [item]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart(
      item,
      quantity,
      item.proteins ? selectedProtein : undefined,
      item.sides ? selectedSide : undefined,
      notes
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-modal-product="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl liquid-glass overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[88vh] border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white/90 hover:text-white transition-colors cursor-pointer border border-white/20 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabecera con foto protagonista optimizada en altura para dejar espacio al contenido */}
        <div className="relative w-full h-44 sm:h-52 shrink-0 overflow-hidden bg-black/70">
          <Image
            src={item.photo}
            alt={item.name}
            fill
            sizes="500px"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 z-10">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff5a2b] bg-black/80 px-2.5 py-1 rounded-md border border-white/15 backdrop-blur-md">
              {item.categoryName}
            </span>
          </div>
        </div>

        {/* Cuerpo del modal scrolleable con padding inferior amplio (sin cortes) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-black/75 flex-1 min-h-0 pb-16 sm:pb-20">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {item.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              {item.desc}
            </p>
          </div>

          {/* Lista fija de incluidos para el Almuerzo */}
          {item.includedItems && item.includedItems.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-xs uppercase font-bold text-[#ff5a2b] tracking-wider block">
                Incluye de forma fija:
              </span>
              <ul className="text-xs text-white/90 space-y-1 list-disc list-inside">
                {item.includedItems.map((inc, i) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Selector de Proteína (Obligatorio para Almuerzo a la Parrilla: 1 de 7) */}
          {item.proteins && item.proteins.length > 0 && (
            <div data-options-group="protein" className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  Elige tu Proteína <span className="text-[#ff5a2b]">*</span>
                </label>
                <span className="text-[11px] text-white/50">Obligatorio (1)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.proteins.map((protein) => {
                  const isSelected = selectedProtein === protein;
                  return (
                    <button
                      key={protein}
                      type="button"
                      onClick={() => setSelectedProtein(protein)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-fenix-blue/30 border-[#0066ff] text-white shadow-md shadow-blue-900/30"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <span>{protein}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#0066ff] flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector de Acompañante (Obligatorio para Parrillas y Almuerzo) */}
          {item.sides && item.sides.length > 0 && (
            <div data-options-group="side" className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  Elige tu Acompañante <span className="text-[#ff5a2b]">*</span>
                </label>
                <span className="text-[11px] text-white/50">Obligatorio (1)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.sides.map((side) => {
                  const isSelected = selectedSide === side;
                  return (
                    <button
                      key={side}
                      type="button"
                      onClick={() => setSelectedSide(side)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-fenix-fire/30 border-[#ff5a2b] text-white shadow-md shadow-orange-900/30"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <span>{side}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#ff5a2b] flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notas especiales */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">
              Instrucciones o notas especiales
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. sin cebolla, término medio, etc."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#ff5a2b] transition-colors"
            />
          </div>
        </div>

        {/* Barra fija inferior: sin cubrir el contenido, con shrink-0 */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-white/10 bg-black/90 backdrop-blur-xl flex items-center justify-between gap-4 z-10">
          {/* Contador de cantidad */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
            <button
              type="button"
              aria-label="Disminuir cantidad"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 rounded-full text-white/70 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-white w-4 text-center">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Aumentar cantidad"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 rounded-full text-white/70 hover:text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Botón de agregar sin precio */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-fenix-gradient hover:opacity-95 text-white font-bold px-6 py-3 text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-950/40 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Agregar al pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
}

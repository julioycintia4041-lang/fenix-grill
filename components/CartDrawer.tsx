"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  MapPin,
  Store,
  Bike,
  Check,
} from "lucide-react";
import {
  MenuItem,
  RESTAURANT_INFO,
  PAYMENT_METHODS,
  PaymentMethod,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/data/menu";

export interface CartItem {
  id: string; // unique cart entry id
  item: MenuItem;
  quantity: number;
  selectedProtein?: string;
  selectedSide?: string;
  notes?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Zelle");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  const totalItemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  // Bloquear scroll del body al abrir el drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Construcción dinámica de la URL de WhatsApp con el pedido y método de pago
  const whatsappMessage = buildWhatsAppMessage({
    deliveryType,
    paymentMethod,
    customerName: customerName.trim() || "Cliente",
    customerPhone: customerPhone.trim() || "Por coordinar",
    address: address.trim(),
    notes: notes.trim(),
    items,
  });

  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <aside
        data-cart-drawer="true"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md liquid-glass border-l border-white/20 shadow-2xl flex flex-col transition-transform duration-300 ease-out bg-[#0a0a0f]/95 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabecera del drawer */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ff5a2b]/20 border border-[#ff5a2b]/40 text-[#ff5a2b]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Tu Pedido Fénix
              </h2>
              <span className="text-xs text-white/60">
                {totalItemCount} {totalItemCount === 1 ? "ítem" : "ítems"} seleccionados
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/5 text-xs transition-colors cursor-pointer"
                title="Vaciar carrito"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar pedido"
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de ítems o mensaje vacío */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50 space-y-3">
              <div className="p-4 rounded-full bg-white/5 border border-white/10">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <p className="text-base font-semibold text-white">Tu carrito está vacío</p>
              <p className="text-xs max-w-xs text-white/60">
                Explora nuestras Hamburguesas a la Parrilla, Especiales de Parrillas y Almuerzos para armar tu pedido.
              </p>
            </div>
          ) : (
            items.map((cartItem) => (
              <div
                key={cartItem.id}
                data-cart-item-id={cartItem.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex gap-3 items-start"
              >
                {/* Miniatura foto */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10 p-1">
                  <Image
                    src={cartItem.item.photo}
                    alt={cartItem.item.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>

                {/* Detalles */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-sm font-bold text-white truncate">
                      {cartItem.item.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(cartItem.id)}
                      className="text-white/40 hover:text-red-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Opciones elegidas */}
                  {cartItem.selectedProtein && (
                    <p className="text-[11px] text-white/70">
                      <span className="text-[#3b82f6] font-semibold">Proteína:</span>{" "}
                      {cartItem.selectedProtein}
                    </p>
                  )}
                  {cartItem.selectedSide && (
                    <p className="text-[11px] text-white/70">
                      <span className="text-[#ff5a2b] font-semibold">Acompañante:</span>{" "}
                      {cartItem.selectedSide}
                    </p>
                  )}
                  {cartItem.notes && (
                    <p className="text-[10px] text-white/50 italic truncate">
                      &quot;{cartItem.notes}&quot;
                    </p>
                  )}

                  {/* Selector de cantidad SIN precio */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/40 rounded-full border border-white/10 px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(cartItem.id, cartItem.quantity - 1)
                        }
                        className="text-white/60 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white min-w-3 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(cartItem.id, cartItem.quantity + 1)
                        }
                        className="text-white/60 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                      Listo
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Formulario de entrega si hay ítems */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-4">
              {/* Modalidad de entrega */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white">
                  Modalidad de entrega
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      deliveryType === "delivery"
                        ? "bg-fenix-fire/30 border-[#ff5a2b] text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <Bike className="w-4 h-4 text-[#ff5a2b]" />
                    <span>A Domicilio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      deliveryType === "pickup"
                        ? "bg-fenix-blue/30 border-[#0066ff] text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <Store className="w-4 h-4 text-[#0066ff]" />
                    <span>Recoger en Local</span>
                  </button>
                </div>
              </div>

              {/* Método de pago (Cambio 3 - Prompt 2c) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">
                    Método de pago <span className="text-[#ff5a2b]">*</span>
                  </label>
                  <span className="text-[10px] text-white/50">Obligatorio</span>
                </div>
                <div data-payment-options="true" className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        data-payment-method={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/20 border-emerald-400 text-white shadow-md shadow-emerald-950/40"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span>{method}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Información de sede */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ff5a2b] shrink-0 mt-0.5" />
                <div className="text-[11px] text-white/80 leading-relaxed">
                  <span className="font-bold text-white block">Sede Fénix Grill Bar:</span>
                  {RESTAURANT_INFO.address}
                </div>
              </div>

              {/* Datos del cliente */}
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Tu Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#ff5a2b]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Número de Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej. 0414 123 4567"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#ff5a2b]"
                  />
                </div>

                {deliveryType === "delivery" && (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                      Dirección exacta de entrega
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle, sector, punto de referencia..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#ff5a2b]"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                    Observaciones o instrucciones adicionales
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Opcional: hora estimada, cambio en efectivo, etc."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#ff5a2b]"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs text-red-400 font-medium bg-red-950/40 p-2.5 rounded-lg border border-red-500/20">
                  {formError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pie con enlace directo a WhatsApp (Cambio 5 - Prompt 2c): SIN precios, subtotales ni totales */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-black/85 space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Precios:</span>
              <span className="font-semibold text-white/80">A confirmar por el local</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-whatsapp-order-btn="true"
              onClick={(e) => {
                if (items.length === 0) {
                  e.preventDefault();
                  setFormError("Agrega al menos un plato a tu pedido.");
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold px-6 py-3.5 text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-950/40 cursor-pointer text-center select-none"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Confirmar pedido vía WhatsApp</span>
            </a>
          </div>
        )}
      </aside>
    </>
  );
}

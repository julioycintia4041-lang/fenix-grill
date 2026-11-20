import rawMenu from "./menu-fenix.json";

/**
 * Constante oficial única para el pedido por WhatsApp con el número real de Fénix Grill.
 */
export const WHATSAPP_NUMBER = "+584227347307";

export const RESTAURANT_INFO = {
  name: rawMenu.restaurant || "FÉNIX GRILL BAR",
  slogan: rawMenu.slogan || "Donde el sabor renace",
  address: rawMenu.address || "Av. Ferrero Tamayo, Boulevard Hotel Rey, San Cristóbal (Venezuela)",
  whatsapp: WHATSAPP_NUMBER,
  whatsapp_display: rawMenu.whatsapp_display || "0422 734 73 07",
};

export interface RawMenuItem {
  name_es: string;
  desc_es: string;
  price: number | null;
  photo: string | null;
  flag?: string;
  proteins_es?: string[];
  sides_es?: string[];
  includes_es?: string[];
}

export interface RawCategory {
  id: number;
  name_es: string;
  items: RawMenuItem[];
}

export interface MenuItem {
  id: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  name: string;
  desc: string;
  price: number | null;
  photo: string;
  flag?: string;
  // Reglas de opciones según categoría
  hasOptions: boolean;
  proteins?: string[];
  sides?: string[];
  includedItems?: string[];
}

export interface MenuCategory {
  id: number;
  slug: string;
  name: string;
  items: MenuItem[];
}

/**
 * Mapeo oficial de fotos de platos según el Prompt 2 de Fénix Grill.
 * Las 8 imágenes WebP transparentes están guardadas en /public/platos/
 */
export const DISH_PHOTO_MAP: Record<string, string> = {
  "Parrilla Fénix Personal": "/platos/parrilla-personal.webp",
  "Parrilla Fénix Dúo": "/platos/parrilla-duo.webp",
  "Parrilla Fénix Familiar": "/platos/parrilla-familiar.webp",
  "Almuerzo a la Parrilla": "/platos/almuerzo-parrilla.webp",
  "Triple Mixta Fénix": "/platos/hamburguesa-hero.webp",
  "Búfalo King": "/platos/hamburguesa-hero.webp",
  "Pollo Crispy": "/platos/hamburguesa-2.webp",
  "Suprema de Pollo": "/platos/hamburguesa-2.webp",
  "Churrasco de Pollo": "/platos/hamburguesa-2.webp",
  "Croqueta de Carne": "/platos/hamburguesa-3.webp",
  "Lomo de Cerdo": "/platos/hamburguesa-3.webp",
  "Mixta": "/platos/hamburguesa-3.webp",
  "Keto Fénix": "/platos/hamburguesa-4.webp",
  "Combo Express": "/platos/hamburguesa-4.webp",
};

export const CATEGORY_SLUGS: Record<number, string> = {
  1: "hamburguesas",
  2: "parrillas",
  3: "almuerzos",
};

export const PARRILLA_SIDES = ["Papas fritas", "Yuca frita"];

export const FENIX_MENU_CATEGORIES: MenuCategory[] = rawMenu.categories.map((cat: RawCategory) => {
  const slug = CATEGORY_SLUGS[cat.id] || `categoria-${cat.id}`;
  
  const items: MenuItem[] = cat.items.map((item: RawMenuItem, index: number) => {
    const photo = DISH_PHOTO_MAP[item.name_es] || (item.photo ? `/platos/${item.photo}` : "/platos/hamburguesa-hero.webp");
    
    // Reglas estrictas de opciones según Prompt 2:
    // 1. Hamburguesas (cat 1): SIN opciones (hasOptions: false). Mixta no tiene selector.
    // 2. Parrillas (cat 2): UNA opción obligatoria de acompañante (Papas fritas preseleccionada vs Yuca frita).
    // 3. Almuerzo (cat 3): DOS opciones obligatorias (Proteína: 1 de 7; Acompañante: 1 de 3) + Lista fija de incluidos.
    let hasOptions = false;
    let sides: string[] | undefined = undefined;
    let proteins: string[] | undefined = undefined;
    let includedItems: string[] | undefined = undefined;

    if (cat.id === 2) {
      hasOptions = true;
      sides = PARRILLA_SIDES;
    } else if (cat.id === 3) {
      hasOptions = true;
      proteins = item.proteins_es || [
        "Milanesa de pollo",
        "Churrasco de pollo",
        "Churrasco de novillo",
        "Bisteck de novillo",
        "Lomo de cerdo",
        "Pollo crispy",
        "Croqueta de carne",
      ];
      sides = item.sides_es || ["Papas fritas", "Papas rústicas", "Yuca frita"];
      includedItems = item.includes_es || [
        "Ensalada fresca del día",
        "Queso de búfala a la parrilla",
        "Jugo del día",
      ];
    }

    return {
      id: `${slug}-${index + 1}`,
      categoryId: cat.id,
      categoryName: cat.name_es,
      categorySlug: slug,
      name: item.name_es,
      desc: item.desc_es,
      price: item.price, // null en este demo
      photo,
      flag: item.flag,
      hasOptions,
      proteins,
      sides,
      includedItems,
    };
  });

  return {
    id: cat.id,
    slug,
    name: cat.name_es,
    items,
  };
});

export const ALL_MENU_ITEMS: MenuItem[] = FENIX_MENU_CATEGORIES.flatMap((c) => c.items);

export const PAYMENT_METHODS = [
  "Zelle",
  "Pago Móvil",
  "Nequi",
  "Efectivo",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function buildWhatsAppMessage(params: {
  deliveryType: "delivery" | "pickup";
  paymentMethod: PaymentMethod | string;
  customerName: string;
  customerPhone: string;
  address?: string;
  notes?: string;
  items: Array<{
    item: MenuItem;
    quantity: number;
    selectedProtein?: string;
    selectedSide?: string;
    notes?: string;
  }>;
}): string {
  const isDelivery = params.deliveryType === "delivery";
  const lines: string[] = [
    `🔥 *NUEVO PEDIDO — ${RESTAURANT_INFO.name}*`,
    `📍 *Sede:* ${RESTAURANT_INFO.address}`,
    `🛵 *Modalidad:* ${isDelivery ? "Entrega a Domicilio" : "Para Retirar en Local"}`,
    `💳 *Método de pago:* ${params.paymentMethod || "Zelle"}`,
    `👤 *Cliente:* ${params.customerName.trim()}`,
    `📱 *Teléfono:* ${params.customerPhone.trim()}`,
  ];

  if (isDelivery && params.address?.trim()) {
    lines.push(`🏠 *Dirección de entrega:* ${params.address.trim()}`);
  }

  if (params.notes?.trim()) {
    lines.push(`📝 *Indicaciones/Notas:* ${params.notes.trim()}`);
  }

  lines.push("", `📋 *DETALLE DEL PEDIDO:*`);

  params.items.forEach((entry, idx) => {
    lines.push(`${idx + 1}. *${entry.quantity}x ${entry.item.name}*`);
    if (entry.selectedProtein) {
      lines.push(`   └ *Proteína:* ${entry.selectedProtein}`);
    }
    if (entry.selectedSide) {
      lines.push(`   └ *Acompañante:* ${entry.selectedSide}`);
    }
    if (entry.item.includedItems && entry.item.includedItems.length > 0) {
      lines.push(`   └ *Incluye:* ${entry.item.includedItems.join(", ")}`);
    }
    if (entry.notes?.trim()) {
      lines.push(`   └ *Nota:* ${entry.notes.trim()}`);
    }
  });

  lines.push(
    "",
    "_(Pedido generado desde la carta digital de Fénix Grill Bar — Precios a confirmar por el local)_"
  );

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

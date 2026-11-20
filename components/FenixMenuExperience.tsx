"use client";

import { useEffect, useState, useCallback } from "react";
import { FENIX_MENU_CATEGORIES, MenuItem } from "@/data/menu";
import Navbar from "./Navbar";
import HeroBanner from "./HeroBanner";
import MenuCategorySection from "./MenuCategorySection";
import ProductModal from "./ProductModal";
import CartDrawer, { CartItem } from "./CartDrawer";
import FooterInfo from "./FooterInfo";

export default function FenixMenuExperience() {
  const [activeCategory, setActiveCategory] = useState<string>("hamburguesas");
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Scroll-Spy: detecta cuál categoría está visible en el viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute("data-category-slug");
            if (slug) {
              setActiveCategory(slug);
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    const sections = document.querySelectorAll("[data-category-slug]");
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  const handleNavigateToCategory = useCallback((slug: string) => {
    setActiveCategory(slug);
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Agregar rápido: para hamburguesas sin opciones va directo al carrito
  const handleQuickAdd = (item: MenuItem) => {
    if (item.hasOptions) {
      setModalItem(item);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === existing.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prev,
        {
          id: `${item.id}-${Date.now()}`,
          item,
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
  };

  // Agregar desde el modal de personalización
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    selectedProtein?: string,
    selectedSide?: string,
    notes?: string
  ) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: `${item.id}-${Date.now()}`,
        item,
        quantity,
        selectedProtein,
        selectedSide,
        notes,
      },
    ]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(cartId);
      return;
    }
    setCartItems((prev) =>
      prev.map((ci) => (ci.id === cartId ? { ...ci, quantity } : ci))
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="relative min-h-screen text-white">
      {/* Barra de navegación superior fija con Scroll-Spy y Carrito */}
      <Navbar
        activeCategory={activeCategory}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateToCategory={handleNavigateToCategory}
      />

      {/* Contenido interactivo del menú montado en z-10 sobre el Scroll-Motion Canvas (z-0) */}
      <main className="relative z-10">
        {/* Banner de inicio */}
        <HeroBanner
          onExploreClick={() => handleNavigateToCategory("hamburguesas")}
        />

        {/* Las 3 Categorías del Menú oficial en carruseles horizontales */}
        <div className="space-y-6 sm:space-y-12">
          {FENIX_MENU_CATEGORIES.map((category) => (
            <MenuCategorySection
              key={category.id}
              category={category}
              onOpenModal={(item) => setModalItem(item)}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>

        {/* Pie de página con información de sede, horarios y WhatsApp */}
        <FooterInfo />
      </main>

      {/* Modal de personalización de producto */}
      <ProductModal
        item={modalItem}
        isOpen={Boolean(modalItem)}
        onClose={() => setModalItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Drawer lateral de Carrito / Pedido WhatsApp */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

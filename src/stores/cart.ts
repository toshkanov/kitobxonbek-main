"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
  mergeCart as mergeCartApi,
  applyPromo as applyPromoApi,
} from "@/lib/api/cart";
import type { CartItemResponse, CartResponse, PromoResponse } from "@/lib/api/cart";
import { toast } from "sonner";

interface CartItem {
  id: string;
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  bookImage: string | null;
  format: "paperback" | "ebook" | "audiobook";
  quantity: number;
  price: number;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  isOpen: boolean;
  isLoading: boolean;
  promo: PromoResponse | null;
  fetchCart: () => Promise<void>;
  addItem: (bookId: string, format?: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  mergeCart: () => Promise<void>;
  applyPromo: (code: string) => Promise<void>;
  clearPromo: () => void;
}

function mapCartItem(item: CartItemResponse): CartItem {
  return {
    id: item.id,
    bookId: item.book,
    bookSlug: item.book_slug,
    bookTitle: item.book_title,
    bookImage: item.book_image,
    format: item.format,
    quantity: item.quantity,
    price: parseFloat(item.unit_price),
    totalPrice: parseFloat(item.total_price),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,
      totalItems: 0,
      isOpen: false,
      isLoading: false,
      promo: null,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const cart = await getCart();
          set({
            items: cart.items.map(mapCartItem),
            totalAmount: parseFloat(cart.total_amount),
            totalItems: cart.total_items,
          });
        } catch {
          // ignore
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (bookId, format = "paperback", quantity = 1) => {
        set({ isLoading: true });
        try {
          await addItemToCart(bookId, format, quantity);
          await get().fetchCart();
        } catch (error: unknown) {
          const err = error as { response?: { data?: { error?: string } } };
          toast.error(err.response?.data?.error ?? "Savatga qo'shishda xatolik");
        } finally {
          set({ isLoading: false });
        }
      },

      updateItemQuantity: async (itemId, quantity) => {
        set({ isLoading: true });
        try {
          await updateCartItem(itemId, quantity);
          await get().fetchCart();
        } catch {
          toast.error("Miqdorni o'zgartirishda xatolik");
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true });
        try {
          await removeCartItem(itemId);
          await get().fetchCart();
        } catch {
          toast.error("Olib tashlashda xatolik");
        } finally {
          set({ isLoading: false });
        }
      },

      clear: async () => {
        set({ isLoading: true });
        try {
          await clearCartApi();
          set({ items: [], totalAmount: 0, totalItems: 0, promo: null });
        } catch {
          toast.error("Savatni tozalashda xatolik");
        } finally {
          set({ isLoading: false });
        }
      },

      mergeCart: async () => {
        try {
          const cart = await mergeCartApi();
          set({
            items: cart.items.map(mapCartItem),
            totalAmount: parseFloat(cart.total_amount),
            totalItems: cart.total_items,
          });
        } catch {
          // ignore
        }
      },

      applyPromo: async (code) => {
        try {
          const promo = await applyPromoApi(code, get().totalAmount);
          set({ promo });
          toast.success("Promo kod qo'llanildi");
        } catch (error: unknown) {
          const err = error as { response?: { data?: { error?: string } } };
          toast.error(err.response?.data?.error ?? "Promo kod noto'g'ri");
        }
      },

      clearPromo: () => set({ promo: null }),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "kitobxon-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

import { api } from "@/lib/api";

export interface CartItemResponse {
  id: string;
  book: string;
  book_title: string;
  book_slug: string;
  book_image: string | null;
  format: "paperback" | "ebook" | "audiobook";
  quantity: number;
  unit_price: string;
  total_price: string;
  added_at: string;
}

export interface CartResponse {
  id: string;
  items: CartItemResponse[];
  total_amount: string;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface PromoResponse {
  promo: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  discount_amount: string;
  new_total: string;
}

export async function getCart() {
  const { data } = await api.get<CartResponse>("/cart/");
  return data;
}

export async function addItemToCart(bookId: string, format = "paperback", quantity = 1) {
  const { data } = await api.post<CartItemResponse>("/cart/items/", {
    book: bookId,
    format,
    quantity,
  });
  return data;
}

export async function updateCartItem(itemId: string, quantity: number) {
  const { data } = await api.patch<CartItemResponse>("/cart/items_update/", {
    item_id: itemId,
    quantity,
  });
  return data;
}

export async function removeCartItem(itemId: string) {
  const { data } = await api.delete(`/cart/items_delete/?item_id=${itemId}`);
  return data;
}

export async function clearCart() {
  const { data } = await api.post("/cart/clear/");
  return data;
}

export async function mergeCart() {
  const { data } = await api.post<CartResponse>("/cart/merge/");
  return data;
}

export async function applyPromo(code: string, cartTotal: number) {
  const { data } = await api.post<PromoResponse>("/cart/apply_promo/", {
    code,
    cart_total: cartTotal.toString(),
  });
  return data;
}

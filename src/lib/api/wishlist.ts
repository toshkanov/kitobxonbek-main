import { api } from "@/lib/api";

export interface WishlistItem {
  id: string;
  book: string;
  book_title: string;
  book_slug: string;
  book_price: string;
  book_image: string | null;
  added_at: string;
}

export async function getWishlist() {
  const { data } = await api.get<WishlistItem[]>("/wishlist/");
  return data;
}

export async function toggleWishlist(bookId: string) {
  const { data } = await api.post<WishlistItem | { message: string }>(
    `/wishlist/${bookId}/toggle/`
  );
  return data;
}

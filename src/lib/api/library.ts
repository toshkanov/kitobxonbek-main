import { api } from "@/lib/api";

export interface LibraryItem {
  id: string;
  book: {
    id: string;
    title: string;
    slug: string;
    short_description: string;
    effective_price: string;
    average_rating: string;
    review_count: number;
  };
  format: "ebook" | "audiobook";
  purchased_at: string;
  download_count: number;
  last_read_position: Record<string, unknown> | null;
  is_favorite: boolean;
}

export async function getLibrary() {
  const { data } = await api.get<LibraryItem[]>("/library/");
  return data;
}

export async function downloadBook(id: string) {
  const { data } = await api.get<{ download_url: string }>(`/library/${id}/download/`);
  return data;
}

export async function saveProgress(
  id: string,
  data: { current_page?: number; current_time_seconds?: number; progress_percentage: number }
) {
  const { data: response } = await api.post(`/library/${id}/progress/`, data);
  return response;
}

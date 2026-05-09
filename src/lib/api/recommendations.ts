import { api } from "@/lib/api";
import type { BackendBookList } from "./books";

export async function getRecommendationsForYou() {
  const { data } = await api.get<{ reason: string; books: BackendBookList[] }>(
    "/recommendations/for_you/",
  );
  return data;
}

export async function getTrendingRecommendations() {
  const { data } = await api.get<BackendBookList[]>("/recommendations/trending/");
  return data;
}

export async function getSimilarRecommendations(bookSlug: string) {
  const { data } = await api.get<BackendBookList[]>(
    `/recommendations/similar/?book_slug=${encodeURIComponent(bookSlug)}`,
  );
  return data;
}


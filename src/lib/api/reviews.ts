import { api } from "@/lib/api";

export interface ReviewImage {
  id: string;
  image: string;
}

export interface ReviewReply {
  id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface Review {
  id: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string | null;
  };
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  images: ReviewImage[];
  replies: ReviewReply[];
  user_has_voted: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Review[];
}

export async function getReviews(bookSlug: string, page = 1) {
  const { data } = await api.get<ReviewsResponse>(
    `/books/${bookSlug}/reviews/?page=${page}`
  );
  return data;
}

export async function createReview(bookSlug: string, data: { rating: number; title: string; comment: string }) {
  const { data: response } = await api.post<Review>(`/books/${bookSlug}/reviews/`, data);
  return response;
}

export async function updateReview(id: string, data: { rating?: number; title?: string; comment?: string }) {
  const { data: response } = await api.patch<Review>(`/reviews/${id}/`, data);
  return response;
}

export async function deleteReview(id: string) {
  const { data } = await api.delete(`/reviews/${id}/`);
  return data;
}

export async function voteReview(id: string, isHelpful: boolean) {
  const { data } = await api.post<{ helpful_count: number }>(`/reviews/${id}/vote/`, {
    is_helpful: isHelpful,
  });
  return data;
}

export async function replyReview(id: string, comment: string) {
  const { data } = await api.post<ReviewReply>(`/reviews/${id}/reply/`, { comment });
  return data;
}

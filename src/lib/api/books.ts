import { api } from "@/lib/api";

export interface BackendAuthor {
  id: string;
  full_name: string;
  slug: string;
  bio: string;
  photo: string | null;
  birth_date: string | null;
  nationality: string;
  is_featured: boolean;
  book_count?: number;
}

export interface BackendGenre {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  icon: string;
  children?: BackendGenre[];
}

export interface BackendBookImage {
  id: string;
  image: string;
  is_primary: boolean;
  order: number;
}

export interface BackendBook {
  id: string;
  title: string;
  slug: string;
  isbn: string;
  description: string;
  short_description: string;
  price: string;
  discount_price: string | null;
  discount_percentage: number | null;
  stock_quantity: number;
  page_count: number;
  cover_type: string;
  publication_date: string;
  view_count: number;
  sold_count: number;
  average_rating: string;
  review_count: number;
  is_published: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  has_paperback: boolean;
  has_ebook: boolean;
  has_audiobook: boolean;
  authors: BackendAuthor[];
  publisher: { id: string; name: string; slug: string } | null;
  genres: BackendGenre[];
  language: { id: string; code: string; name: string };
  images: BackendBookImage[];
  effective_price: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface BackendBookList {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  authors: BackendAuthor[];
  primary_image: { id: string; image: string; is_primary: boolean; order: number } | null;
  price: string;
  discount_price: string | null;
  discount_percentage: number | null;
  effective_price: string;
  stock_quantity: number;
  in_stock: boolean;
  average_rating: string;
  review_count: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  has_ebook: boolean;
  has_audiobook: boolean;
  created_at: string;
}

export interface BackendCollection {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  is_featured: boolean;
  order: number;
  books?: BackendBookList[];
}

export interface BackendPublisher {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  book_count?: number;
}

export interface BooksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BackendBookList[];
}

export async function fetchBooks(params?: Record<string, string>) {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
  const { data } = await api.get<BooksResponse>(`/catalog/books/${queryString}`);
  return data;
}

export async function fetchBookBySlug(slug: string) {
  const { data } = await api.get<BackendBook>(`/catalog/books/${slug}/`);
  return data;
}

export async function fetchBestsellers() {
  const { data } = await api.get<BackendBookList[]>("/catalog/books/bestsellers/");
  return data;
}

export async function fetchNewArrivals() {
  const { data } = await api.get<BackendBookList[]>("/catalog/books/new-arrivals/");
  return data;
}

export async function fetchFeaturedBooks() {
  const { data } = await api.get<BackendBookList[]>("/catalog/books/featured/");
  return data;
}

export async function fetchRelatedBooks(slug: string) {
  const { data } = await api.get<BackendBookList[]>(`/catalog/books/${slug}/related/`);
  return data;
}

export async function fetchAuthors() {
  const { data } = await api.get<BackendAuthor[] | { results: BackendAuthor[] }>("/catalog/authors/");
  return Array.isArray(data) ? data : data.results;
}

export interface BackendAuthorDetail extends BackendAuthor {
  death_date: string | null;
  books: BackendBookList[];
}

export async function fetchAuthorBySlug(slug: string) {
  const { data } = await api.get<BackendAuthorDetail>(`/catalog/authors/${slug}/`);
  return data;
}

export async function fetchGenres() {
  const { data } = await api.get<BackendGenre[]>("/catalog/genres/");
  return data;
}

export async function fetchCollections() {
  const { data } = await api.get<BackendCollection[] | { results: BackendCollection[] }>("/catalog/collections/");
  return Array.isArray(data) ? data : data.results;
}

export async function fetchCollectionBySlug(slug: string) {
  const { data } = await api.get<BackendCollection>(`/catalog/collections/${slug}/`);
  return data;
}

export async function fetchPublishers() {
  const { data } = await api.get<BackendPublisher[] | { results: BackendPublisher[] }>("/catalog/publishers/");
  return Array.isArray(data) ? data : data.results;
}

export async function fetchPublisherBySlug(slug: string) {
  const { data } = await api.get<BackendPublisher>(`/catalog/publishers/${slug}/`);
  return data;
}

export async function searchBooks(query: string) {
  const { data } = await api.get<BackendBook[]>(`/catalog/search/?q=${encodeURIComponent(query)}`);
  return data;
}

export async function fetchSearchSuggestions(query: string) {
  const { data } = await api.get<
    { id: string; title: string; slug: string; authors: string; price: string }[]
  >(`/catalog/search/suggestions/?q=${encodeURIComponent(query)}`);
  return data;
}

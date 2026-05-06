export type BookFormat = "paperback" | "ebook" | "audio";

export interface Author {
  id: string;
  slug: string;
  name: string;
  bio?: string;
  photo?: string;
  bookCount?: number;
}

export interface Genre {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  bookCount?: number;
}

export interface BookFormatOption {
  format: BookFormat;
  price: number;
  oldPrice?: number;
  stock: number;
  isAvailable: boolean;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description?: string;
  coverImage: string;
  images?: string[];
  authors: Author[];
  genres: Genre[];
  language: string;
  isbn?: string;
  pageCount?: number;
  publishedAt?: string;
  publisher?: string;
  rating: number;
  reviewCount: number;
  formats: BookFormatOption[];
  defaultFormat: BookFormat;
}

export interface CartItem {
  bookId: string;
  book: Pick<Book, "id" | "slug" | "title" | "coverImage" | "authors">;
  format: BookFormat;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  emailVerified: boolean;
}

export interface Address {
  id: string;
  label: string;
  region: string;
  district: string;
  street: string;
  apartment?: string;
  postalCode?: string;
  isDefault: boolean;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  bookId: string;
  title: string;
  coverImage: string;
  format: BookFormat;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
  address?: Address;
}

export interface BookFilters {
  genres?: string[];
  authors?: string[];
  languages?: string[];
  formats?: BookFormat[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  search?: string;
  sort?: "newest" | "popular" | "price_asc" | "price_desc" | "rating";
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

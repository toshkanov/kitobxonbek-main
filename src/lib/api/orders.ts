import { api } from "@/lib/api";

export interface OrderItem {
  id: string;
  book: string;
  book_title: string;
  book_price: string;
  format: "paperback" | "ebook" | "audiobook";
  quantity: number;
  total_price: string;
}

export interface Order {
  id: string;
  order_number: string;
  delivery_address: Record<string, unknown>;
  delivery_method: "pickup" | "courier" | "post";
  delivery_fee: string;
  subtotal: string;
  discount_amount: string;
  bonus_used: number;
  total_amount: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_method: "click" | "payme" | "cash" | "card";
  customer_note: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  delivered_at: string | null;
}

export interface TrackResponse {
  order_number: string;
  status: string;
  status_display: string;
  history: {
    id: string;
    status: string;
    note: string;
    changed_by_name: string;
    created_at: string;
  }[];
}

export async function createOrder(data: {
  delivery_method: "pickup" | "courier" | "post";
  delivery_address: Record<string, unknown>;
  payment_method: "click" | "payme" | "cash" | "card";
  promo_code?: string;
  use_bonus?: boolean;
  customer_note?: string;
}) {
  const { data: response } = await api.post<Order>("/orders/", data);
  return response;
}

export async function getOrders() {
  const { data } = await api.get<{ results: Order[] }>("/orders/");
  return data.results;
}

export async function getOrder(orderNumber: string) {
  const { data } = await api.get<Order>(`/orders/${orderNumber}/`);
  return data;
}

export async function cancelOrder(orderNumber: string) {
  const { data } = await api.post<Order>(`/orders/${orderNumber}/cancel/`);
  return data;
}

export async function trackOrder(orderNumber: string) {
  const { data } = await api.get<TrackResponse>(`/orders/${orderNumber}/track/`);
  return data;
}

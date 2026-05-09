import { api } from "@/lib/api";

export interface StatsOverview {
  total_users: number;
  total_orders: number;
  total_revenue: string;
  total_books: number;
  avg_order_value: string;
  conversion_rate: number;
}

export interface SalesStats {
  period: "week" | "month" | "year" | string;
  total_sales: number;
  total_revenue: string;
  avg_order_value: string;
}

export interface TopBook {
  id: string;
  title: string;
  slug: string;
  sold_count: number;
  view_count: number;
  revenue: string;
}

export interface UserStats {
  total: number;
  new_this_week: number;
  new_this_month: number;
  active_buyers: number;
}

export async function getAdminOverview() {
  const { data } = await api.get<StatsOverview>("/admin/stats/overview/");
  return data;
}

export async function getAdminSales(period: "week" | "month" | "year" = "week") {
  const { data } = await api.get<SalesStats>(`/admin/stats/sales/?period=${period}`);
  return data;
}

export async function getAdminTopBooks(limit = 10) {
  const { data } = await api.get<TopBook[]>(`/admin/stats/top_books/?limit=${limit}`);
  return data;
}

export async function getAdminUserStats() {
  const { data } = await api.get<UserStats>("/admin/stats/users/");
  return data;
}


import { api } from "@/lib/api";

export interface Notification {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  type?: string;
  is_read: boolean;
  created_at: string;
  data?: Record<string, unknown> | null;
}

export interface NotificationPreferences {
  id?: string;
  email_orders?: boolean;
  email_promos?: boolean;
  sms_orders?: boolean;
  push_enabled?: boolean;
  telegram_chat_id?: string | null;
}

export async function listNotifications() {
  const { data } = await api.get<Notification[]>("/notifications/");
  return data;
}

export async function listUnreadNotifications() {
  const { data } = await api.get<Notification[]>("/notifications/unread/");
  return data;
}

export async function countUnreadNotifications() {
  const { data } = await api.get<{ count: number }>("/notifications/count_unread/");
  return data;
}

export async function markNotificationRead(id: string) {
  const { data } = await api.post<{ message: string }>(`/notifications/${id}/mark_read/`);
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await api.post<{ message: string }>("/notifications/mark_all_read/");
  return data;
}

export async function getNotificationPreferences() {
  const { data } = await api.get<NotificationPreferences>("/notification-preferences/");
  return data;
}

export async function updateNotificationPreferences(patch: Partial<NotificationPreferences>) {
  const { data } = await api.patch<NotificationPreferences>("/notification-preferences/", patch);
  return data;
}

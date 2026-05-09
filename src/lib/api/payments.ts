import { api } from "@/lib/api";

export interface Payment {
  id: string;
  provider: string;
  status: string;
  amount: string;
  created_at: string;
  updated_at: string;
  raw_response?: unknown;
}

export async function getPaymentStatus(paymentId: string) {
  const { data } = await api.get<Payment>(`/payments/${paymentId}/status/`);
  return data;
}

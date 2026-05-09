import { api } from "@/lib/api";

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: "free" | "silver" | "tilla";
  slug: string;
  price_monthly: string;
  price_yearly: string;
  description: string;
  features: string[];
  ebook_access: boolean;
  audiobook_access: boolean;
  download_limit: number;
}

export interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  billing_cycle: "monthly" | "yearly";
  status: "active" | "expired" | "cancelled" | "pending";
  started_at: string;
  expires_at: string;
  auto_renew: boolean;
  is_active: boolean;
}

export async function fetchSubscriptionPlans() {
  const { data } = await api.get<SubscriptionPlan[] | { results: SubscriptionPlan[] }>("/subscriptions/plans/");
  return Array.isArray(data) ? data : data.results;
}

export async function fetchMySubscription() {
  const { data } = await api.get<UserSubscription>("/subscriptions/me/");
  return data;
}

export async function subscribe(planId: string, billingCycle: "monthly" | "yearly") {
  const { data } = await api.post<UserSubscription>("/subscriptions/me/", {
    plan_id: planId,
    billing_cycle: billingCycle,
  });
  return data;
}

export async function cancelSubscription() {
  const { data } = await api.post("/subscriptions/me/cancel/");
  return data;
}

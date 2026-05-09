"use client";

import { useState, useEffect } from "react";
import { Check, Crown, BookOpen, Headphones, Download, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchSubscriptionPlans, subscribe } from "@/lib/api/subscriptions";
import type { SubscriptionPlan } from "@/lib/api/subscriptions";
import { formatPrice } from "@/lib/format";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { GlassCard } from "@/components/glass";

const TIER_ICONS = {
  free: BookOpen,
  silver: Star,
  tilla: Crown,
};

const TIER_COLORS = {
  free: "text-muted-foreground",
  silver: "text-slate-400",
  tilla: "text-amber-500",
};

const TIER_BADGE = {
  free: "",
  silver: "",
  tilla: "Eng mashhur",
};

function PlanCard({
  plan,
  billingCycle,
  onSubscribe,
  loading,
}: {
  plan: SubscriptionPlan;
  billingCycle: "monthly" | "yearly";
  onSubscribe: (planId: string) => void;
  loading: string | null;
}) {
  const locale = useLocale();
  const Icon = TIER_ICONS[plan.tier];
  const colorClass = TIER_COLORS[plan.tier];
  const badge = TIER_BADGE[plan.tier];
  const isTilla = plan.tier === "tilla";

  const price =
    billingCycle === "yearly"
      ? parseFloat(plan.price_yearly)
      : parseFloat(plan.price_monthly);

  const monthlyEquivalent =
    billingCycle === "yearly"
      ? parseFloat(plan.price_yearly) / 12
      : parseFloat(plan.price_monthly);

  return (
    <GlassCard
      variant={isTilla ? "strong" : "default"}
      className={cn(
        "relative flex flex-col gap-6 p-6 rounded-2xl",
        isTilla && "ring-2 ring-amber-400/60"
      )}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
          {badge}
        </span>
      )}

      <div>
        <div className={cn("flex items-center gap-2 mb-1", colorClass)}>
          <Icon className="size-5" />
          <h2 className="text-xl font-bold">{plan.name}</h2>
        </div>
        {plan.description && (
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        )}
      </div>

      <div>
        {price === 0 ? (
          <span className="text-3xl font-bold">Bepul</span>
        ) : (
          <>
            <span className="text-3xl font-bold">
              {formatPrice(monthlyEquivalent, locale)}
            </span>
            <span className="text-muted-foreground text-sm ml-1">/ oy</span>
            {billingCycle === "yearly" && (
              <p className="text-xs text-muted-foreground mt-1">
                Yillik: {formatPrice(price, locale)} so&apos;m
              </p>
            )}
          </>
        )}
      </div>

      <ul className="flex flex-col gap-2.5 flex-1">
        {plan.ebook_access && (
          <li className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-emerald-500 shrink-0" />
            <BookOpen className="size-3.5 shrink-0 text-muted-foreground" />
            Elektron kitoblarga kirish
          </li>
        )}
        {plan.audiobook_access && (
          <li className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-emerald-500 shrink-0" />
            <Headphones className="size-3.5 shrink-0 text-muted-foreground" />
            Audio kitoblarga kirish
          </li>
        )}
        {plan.download_limit === 0 && (
          <li className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-emerald-500 shrink-0" />
            <Download className="size-3.5 shrink-0 text-muted-foreground" />
            Cheksiz yuklab olish
          </li>
        )}
        {plan.download_limit > 0 && (
          <li className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-emerald-500 shrink-0" />
            <Download className="size-3.5 shrink-0 text-muted-foreground" />
            Oyiga {plan.download_limit} ta yuklab olish
          </li>
        )}
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-emerald-500 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {plan.tier !== "free" && (
        <button
          onClick={() => onSubscribe(plan.id)}
          disabled={loading === plan.id}
          className={cn(
            "w-full rounded-xl py-2.5 text-sm font-semibold transition-all",
            isTilla
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-primary/10 hover:bg-primary/20 text-primary",
            loading === plan.id && "opacity-60 cursor-not-allowed"
          )}
        >
          {loading === plan.id ? "Yuklanmoqda..." : "Obuna bo'lish"}
        </button>
      )}
    </GlassCard>
  );
}

export default function TillaPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionPlans()
      .then(setPlans)
      .catch(() => {});
  }, []);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      await subscribe(planId, billingCycle);
      toast.success("Obuna muvaffaqiyatli faollashtirildi!");
    } catch {
      toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-amber-500 mb-3">
          <Crown className="size-6" />
          <span className="text-sm font-semibold uppercase tracking-widest">Tilla obuna</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">O&apos;qishni yangi darajaga olib chiq</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Minglab elektron va audio kitoblarga cheksiz kirish. Tez, qulay, arzon.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            billingCycle === "monthly"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Oylik
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
            billingCycle === "yearly"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Yillik
          <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            −20%
          </span>
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["free", "silver", "tilla"].map((t) => (
            <div key={t} className="h-96 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              onSubscribe={handleSubscribe}
              loading={loading}
            />
          ))}
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {[
          { icon: Zap, title: "Tez kirish", desc: "Oniy faollashtirish, hech qanday kutish yo'q" },
          { icon: BookOpen, title: "10 000+ kitob", desc: "Elektron va audio formatda" },
          { icon: Download, title: "Oflayn o'qish", desc: "Internetisiz ham o'qing" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-2">
            <div className="bg-primary/10 rounded-full p-3">
              <Icon className="size-5 text-primary" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

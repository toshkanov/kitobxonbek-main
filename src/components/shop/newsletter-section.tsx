"use client";

import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { GlassCard, GlassInput, GlassButton } from "@/components/glass";

export function NewsletterSection() {
  const t = useTranslations("home.newsletter");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Obuna bo'lganingiz uchun rahmat!");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <GlassCard
        variant="strong"
        className="relative overflow-hidden rounded-3xl p-8 md:p-12"
      >
        <div
          aria-hidden
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-300/40 to-sky-400/30 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div className="bg-primary text-primary-foreground grid size-14 shrink-0 place-items-center rounded-2xl">
            <Mail className="size-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t("title")}</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">{t("subtitle")}</p>
          </div>
          <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2 md:w-auto">
            <div className="flex-1">
              <GlassInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                required
                aria-label={t("placeholder")}
              />
            </div>
            <GlassButton type="submit" variant="primary" disabled={loading}>
              {loading ? "..." : t("subscribe")}
            </GlassButton>
          </form>
        </div>
      </GlassCard>
    </section>
  );
}

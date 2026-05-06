import Image from "next/image";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { GlassCard } from "@/components/glass";
import { RatingStars } from "./rating-stars";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";

export function TestimonialsSection() {
  const t = useTranslations("home.sections");

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
        {t("testimonials")}
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {MOCK_TESTIMONIALS.map((tm) => (
          <GlassCard
            key={tm.id}
            variant="default"
            className="flex flex-col gap-4 p-6"
          >
            <Quote className="text-primary/40 size-8" />
            <p className="text-sm leading-relaxed">{tm.text}</p>
            <RatingStars value={tm.rating} />
            <div className="flex items-center gap-3 pt-2">
              <div className="bg-muted relative size-10 overflow-hidden rounded-full">
                <Image src={tm.avatar} alt={tm.name} fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold">{tm.name}</p>
                <p className="text-muted-foreground text-xs">{tm.role}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

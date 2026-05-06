import { useTranslations } from "next-intl";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassButton, GlassCard } from "@/components/glass";
import { SearchBar } from "@/components/shared/search-bar";

export function HeroSection() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-amber-300/40 via-rose-300/30 to-purple-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-300/40 via-emerald-300/30 to-teal-400/30 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24">
        <GlassCard
          variant="strong"
          className="relative overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-20"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="glass mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium tracking-tight">
              <BookOpen className="size-3.5" />
              Yangi kelishlar har hafta
            </span>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-balance mt-4 max-w-xl text-base md:text-lg">
              {t("subtitle")}
            </p>

            <div className="mt-8 w-full max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <GlassButton variant="primary" size="lg" asChild>
                <Link href="/books">
                  {t("browseBooks")}
                  <ArrowRight className="size-4" />
                </Link>
              </GlassButton>
              <GlassButton variant="default" size="lg" asChild>
                <Link href="/genres">{t("exploreGenres")}</Link>
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

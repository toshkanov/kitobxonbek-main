import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/glass";
import { MOCK_GENRES } from "@/lib/mock-data";

export function GenresSection() {
  const t = useTranslations("home.sections");

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
        {t("genres")}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
        {MOCK_GENRES.map((g) => (
          <Link key={g.id} href={`/genres/${g.slug}`} className="group">
            <GlassCard
              variant="default"
              className="flex h-full flex-col items-start gap-2 p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="text-3xl">{g.icon}</span>
              <h3 className="text-base font-semibold tracking-tight">{g.name}</h3>
              <p className="text-muted-foreground text-xs">{g.bookCount} kitob</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/glass";
import { fetchGenres } from "@/lib/api/books";
import type { BackendGenre } from "@/lib/api/books";

const GENRE_EMOJIS: Record<string, string> = {
  badiiy: "📖",
  roman: "📚",
  hikoya: "✍️",
  "shoir": "✒️",
  tarixiy: "🏛️",
  fantastika: "🚀",
  biznes: "💼",
  moliya: "💰",
  "shaxsiy-rivojlanish": "🌱",
  bolalar: "🧸",
  ilmiy: "🔬",
  marketing: "📊",
  diniy: "☪️",
  matematika: "📐",
  fizika: "⚛️",
  "orta-asrlar": "⚔️",
};

function getGenreEmoji(genre: BackendGenre): string {
  if (genre.icon && genre.icon.trim() && !genre.icon.match(/^[a-z-]+$/)) {
    return genre.icon;
  }
  return GENRE_EMOJIS[genre.slug] ?? "📖";
}

export async function GenresSection() {
  const t = await getTranslations("home.sections");

  let genres: BackendGenre[] = [];
  try {
    const all = await fetchGenres();
    genres = all.filter((g) => !g.parent).slice(0, 8);
  } catch {
    // ignore
  }

  if (genres.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t("genres")}</h2>
        <Link href="/genres" className="text-sm text-primary hover:underline">
          Barchasi →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
        {genres.map((g) => (
          <Link key={g.id} href={`/books?genres=${g.slug}`} className="group">
            <GlassCard
              variant="default"
              className="flex h-full flex-col items-start gap-2 p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="text-3xl">{getGenreEmoji(g)}</span>
              <h3 className="text-base font-semibold tracking-tight">{g.name}</h3>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import { fetchGenres } from "@/lib/api/books";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function GenresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("genres");

  let genres: { id: string; name: string; slug: string; icon: string; children?: unknown[] }[] = [];

  try {
    genres = await fetchGenres();
  } catch {
    // ignore
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Link key={genre.id} href={`/books?genres=${genre.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{genre.icon || "📚"}</span>
                  {genre.name}
                </CardTitle>
              </CardHeader>
              {genre.children && genre.children.length > 0 && (
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(genre.children as { name: string; slug: string }[]).map((child) => (
                      <li key={child.slug}>{child.name}</li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

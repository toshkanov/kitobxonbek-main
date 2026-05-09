import { setRequestLocale, getTranslations } from "next-intl/server";
import { getRecommendationsForYou } from "@/lib/api/recommendations";
import { mapBackendBookList } from "@/lib/mappers";
import { BookCard } from "@/components/shop/book-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RecommendationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("recommendations");

  let reason = "";
  let books: ReturnType<typeof mapBackendBookList>[] = [];

  try {
    const data = await getRecommendationsForYou();
    reason = data.reason;
    books = data.books.map(mapBackendBookList);
  } catch {
    // ignore
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        {reason ? (
          <p className="text-sm text-muted-foreground mt-2">{t("reason", { reason })}</p>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">{t("subtitle")}</p>
        )}
      </div>

      {books.length === 0 ? (
        <div className="text-muted-foreground">{t("empty")}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}


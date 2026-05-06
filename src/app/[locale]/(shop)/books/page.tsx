import { setRequestLocale, getTranslations } from "next-intl/server";
import { fetchBooks } from "@/lib/api/books";
import { mapBackendBook } from "@/lib/mappers";
import { BookCard } from "@/components/shop/book-card";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function BooksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("books");

  const sp = await searchParams;
  let books: ReturnType<typeof mapBackendBook>[] = [];
  let total = 0;

  try {
    const result = await fetchBooks(sp);
    books = result.results.map(mapBackendBook);
    total = result.count;
  } catch {
    // If API fails, show empty
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-muted-foreground mb-6">
        {total} {t("booksFound")}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {books.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          {t("noBooks")}
        </div>
      )}
    </div>
  );
}

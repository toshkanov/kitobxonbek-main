import { setRequestLocale } from "next-intl/server";
import { fetchBooks } from "@/lib/api/books";
import { mapBackendBookList } from "@/lib/mappers";
import { BookCard } from "@/components/shop/book-card";
import { SearchBar } from "@/components/shared/search-bar";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const query = sp.q?.trim() ?? "";

  let books: ReturnType<typeof mapBackendBookList>[] = [];
  let total = 0;

  if (query) {
    try {
      const result = await fetchBooks({ search: query });
      books = result.results.map(mapBackendBookList);
      total = result.count;
    } catch {
      // silent
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mb-8">
        <SearchBar />
      </div>

      {!query ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Search className="size-14 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">Qidiruv so&apos;zini kiriting</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              &ldquo;{query}&rdquo; bo&apos;yicha natijalar
            </h1>
            <p className="text-muted-foreground mt-1">{total} ta kitob topildi</p>
          </div>

          {books.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <Search className="size-14 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">Hech narsa topilmadi</p>
              <p className="text-muted-foreground mb-6">
                &ldquo;{query}&rdquo; bo&apos;yicha natija yo&apos;q
              </p>
              <Link
                href="/books"
                className="text-primary underline-offset-4 hover:underline text-sm"
              >
                Barcha kitoblarni ko&apos;rish
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

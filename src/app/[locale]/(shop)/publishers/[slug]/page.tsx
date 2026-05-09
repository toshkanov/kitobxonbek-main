import { setRequestLocale } from "next-intl/server";
import { fetchPublisherBySlug, fetchBooks } from "@/lib/api/books";
import { mapBackendBookList } from "@/lib/mappers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Globe } from "lucide-react";
import { BookCard } from "@/components/shop/book-card";

export const dynamic = "force-dynamic";

export default async function PublisherDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let publisher: Awaited<ReturnType<typeof fetchPublisherBySlug>>;
  try {
    publisher = await fetchPublisherBySlug(slug);
  } catch {
    notFound();
  }

  if (!publisher) notFound();

  let books: ReturnType<typeof mapBackendBookList>[] = [];
  try {
    const data = await fetchBooks({ publisher: slug });
    books = data.results.map(mapBackendBookList);
  } catch {
    // ignore
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/publishers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Barcha nashriyotlar
      </Link>

      <div className="flex flex-wrap items-center gap-6 mb-8">
        {publisher.logo ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
            <Image src={publisher.logo} alt={publisher.name} fill className="object-contain p-2" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl bg-muted shrink-0 flex items-center justify-center text-2xl font-bold text-muted-foreground">
            {publisher.name[0]}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{publisher.name}</h1>
          {publisher.book_count != null && (
            <p className="text-muted-foreground mt-1">{publisher.book_count} ta kitob</p>
          )}
          {publisher.website && (
            <a
              href={publisher.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
            >
              <Globe className="size-4" />
              Sayt
            </a>
          )}
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Bu nashriyot kitoblari topilmadi.
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Kitoblar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

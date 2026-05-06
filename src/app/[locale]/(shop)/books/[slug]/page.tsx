import { setRequestLocale } from "next-intl/server";
import { fetchBookBySlug, fetchRelatedBooks } from "@/lib/api/books";
import { mapBackendBook } from "@/lib/mappers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shop/rating-stars";
import { BookCard } from "@/components/shop/book-card";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let book: ReturnType<typeof mapBackendBook>;
  let related: ReturnType<typeof mapBackendBook>[] = [];

  try {
    const backendBook = await fetchBookBySlug(slug);
    book = mapBackendBook(backendBook);
  } catch {
    notFound();
  }

  try {
    const relatedData = await fetchRelatedBooks(slug);
    related = relatedData.map(mapBackendBook).slice(0, 8);
  } catch {
    // ignore
  }

  const defaultFormat = book.formats.find((f) => f.format === book.defaultFormat) ?? book.formats[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-muted relative aspect-[2/3] overflow-hidden rounded-xl">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-muted-foreground mb-4">
            {book.authors.map((a) => a.name).join(", ")}
          </p>
          <div className="flex items-center gap-2 mb-4">
            <RatingStars value={book.rating} showValue />
            <span className="text-sm text-muted-foreground">
              ({book.reviewCount} sharh)
            </span>
          </div>
          <div className="text-2xl font-bold mb-4">
            {formatPrice(defaultFormat.price, locale)}{" "}
            <span className="text-sm text-muted-foreground">so'm</span>
          </div>
          <p className="text-muted-foreground mb-6">{book.shortDescription}</p>
          <div className="flex gap-2">
            <Button size="lg" className="flex-1">
              Savatga qo'shish
            </Button>
            <Button variant="outline" size="lg">
              Sevimli
            </Button>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
            {book.pageCount && <p><strong>Sahifalar:</strong> {book.pageCount}</p>}
            {book.publisher && <p><strong>Nashriyot:</strong> {book.publisher}</p>}
            <p><strong>Til:</strong> {book.language}</p>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">O'xshash kitoblar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

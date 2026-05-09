import { setRequestLocale } from "next-intl/server";
import { fetchBookBySlug, fetchRelatedBooks } from "@/lib/api/books";
import { getReviews } from "@/lib/api/reviews";
import { mapBackendBook, mapBackendBookList } from "@/lib/mappers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { RatingStars } from "@/components/shop/rating-stars";
import { BookCard } from "@/components/shop/book-card";
import { formatPrice } from "@/lib/format";
import { BookDetailActions } from "@/components/shop/book-detail-actions";
import { BadgeCheck, User } from "lucide-react";
import type { Book } from "@/types";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let book: Book;
  let related: ReturnType<typeof mapBackendBookList>[] = [];

  try {
    const backendBook = await fetchBookBySlug(slug);
    book = mapBackendBook(backendBook);
  } catch {
    notFound();
  }

  try {
    const relatedData = await fetchRelatedBooks(slug);
    related = relatedData.map(mapBackendBookList).slice(0, 8);
  } catch {
    // ignore
  }

  let reviews: Awaited<ReturnType<typeof getReviews>> | null = null;
  try {
    reviews = await getReviews(slug);
  } catch {
    // ignore
  }

  const defaultFormat = book.formats.find((f) => f.format === book.defaultFormat) ?? book.formats[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-muted relative aspect-[2/3] overflow-hidden rounded-xl">
          <Image
            src={book.coverImage || "/placeholder-book.png"}
            alt={book.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <div className="flex flex-wrap gap-1 mb-3">
            {book.authors.map((a) => (
              <Link
                key={a.id}
                href={`/authors/${a.slug}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {a.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <RatingStars value={book.rating} showValue />
            <span className="text-sm text-muted-foreground">({book.reviewCount} sharh)</span>
          </div>
          <div className="text-2xl font-bold mb-4">
            {formatPrice(defaultFormat.price, locale)}{" "}
            <span className="text-sm text-muted-foreground">so&apos;m</span>
          </div>
          <p className="text-muted-foreground mb-6">{book.shortDescription}</p>

          <BookDetailActions book={book} />

          <div className="mt-6 space-y-2 text-sm">
            {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
            {book.pageCount && <p><strong>Sahifalar:</strong> {book.pageCount}</p>}
            {book.publisher && <p><strong>Nashriyot:</strong> {book.publisher}</p>}
            <p><strong>Til:</strong> {book.language}</p>
          </div>

          {book.genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {book.genres.map((g) => (
                <Link
                  key={g.id}
                  href={`/books?genres=${g.slug}`}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {book.description && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Kitob haqida</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{book.description}</p>
        </div>
      )}

      {reviews && reviews.results.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Sharhlar <span className="text-muted-foreground text-lg font-normal">({reviews.count})</span>
          </h2>
          <div className="space-y-4">
            {reviews.results.map((review) => (
              <div key={review.id} className="border rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                    {review.user.avatar ? (
                      <Image src={review.user.avatar} alt={review.user.full_name} width={36} height={36} className="rounded-full" />
                    ) : (
                      <User className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.user.full_name}</span>
                      {review.is_verified_purchase && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <BadgeCheck className="size-3.5" /> Tasdiqlangan xarid
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(review.created_at).toLocaleDateString(locale)}
                      </span>
                    </div>
                    <RatingStars value={review.rating} size="sm" className="mb-2" />
                    {review.title && <p className="font-semibold text-sm mb-1">{review.title}</p>}
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">O&apos;xshash kitoblar</h2>
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

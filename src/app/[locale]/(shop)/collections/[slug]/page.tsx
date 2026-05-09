import { setRequestLocale } from "next-intl/server";
import { fetchCollectionBySlug } from "@/lib/api/books";
import { mapBackendBookList } from "@/lib/mappers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { BookCard } from "@/components/shop/book-card";

export const dynamic = "force-dynamic";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let collection: Awaited<ReturnType<typeof fetchCollectionBySlug>>;
  try {
    collection = await fetchCollectionBySlug(slug);
  } catch {
    notFound();
  }

  if (!collection) notFound();

  const books = (collection.books ?? []).map(mapBackendBookList);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Barcha to&apos;plamlar
      </Link>

      {collection.cover_image && (
        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-8">
          <Image
            src={collection.cover_image}
            alt={collection.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h1 className="text-3xl font-bold text-white">{collection.title}</h1>
            {collection.description && (
              <p className="text-white/80 mt-2 max-w-2xl">{collection.description}</p>
            )}
          </div>
        </div>
      )}

      {!collection.cover_image && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{collection.title}</h1>
          {collection.description && (
            <p className="text-muted-foreground mt-2">{collection.description}</p>
          )}
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-6">{books.length} ta kitob</p>

      {books.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Bu to&apos;plamda hali kitoblar yo&apos;q.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

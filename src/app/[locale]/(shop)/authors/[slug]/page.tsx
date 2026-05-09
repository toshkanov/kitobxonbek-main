import { setRequestLocale } from "next-intl/server";
import { fetchAuthorBySlug } from "@/lib/api/books";
import { mapBackendBookList } from "@/lib/mappers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BookCard } from "@/components/shop/book-card";
import { Calendar, Globe, BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export default async function AuthorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let author;
  try {
    author = await fetchAuthorBySlug(slug);
  } catch {
    notFound();
  }

  const books = (author.books ?? []).map(mapBackendBookList);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/authors"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Barcha mualliflar
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {author.photo && (
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative size-48 overflow-hidden rounded-full ring-4 ring-border">
              <Image
                src={author.photo}
                alt={author.full_name}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{author.full_name}</h1>

          {author.nationality && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Globe className="size-4 shrink-0" />
              <span>{author.nationality}</span>
            </div>
          )}

          {author.birth_date && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="size-4 shrink-0" />
              <span>
                {author.birth_date}
                {author.death_date ? ` — ${author.death_date}` : ""}
              </span>
            </div>
          )}

          {author.bio && (
            <p className="text-muted-foreground leading-relaxed max-w-prose mt-2">
              {author.bio}
            </p>
          )}
        </div>
      </div>

      {books.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="size-5" />
            <h2 className="text-2xl font-bold">
              Muallifning kitoblari
              <span className="text-muted-foreground font-normal ml-2 text-lg">
                ({books.length})
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

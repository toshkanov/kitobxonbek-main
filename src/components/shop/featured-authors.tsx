import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/glass";
import { fetchAuthors } from "@/lib/api/books";
import { User } from "lucide-react";

export async function FeaturedAuthorsSection() {
  const t = await getTranslations("home.sections");

  let authors: Awaited<ReturnType<typeof fetchAuthors>> = [];
  try {
    const all = await fetchAuthors();
    authors = all.filter((a) => a.is_featured).slice(0, 6);
    if (authors.length === 0) {
      authors = all.slice(0, 6);
    }
  } catch {
    // ignore
  }

  if (authors.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t("featuredAuthors")}</h2>
        <Link href="/authors" className="text-sm text-primary hover:underline">
          Barchasi →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {authors.map((author) => (
          <Link key={author.id} href={`/authors/${author.slug}`} className="group">
            <GlassCard
              variant="soft"
              className="flex flex-col items-center gap-3 p-5 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="bg-muted relative size-20 overflow-hidden rounded-full flex items-center justify-center">
                {author.photo ? (
                  <Image
                    src={author.photo}
                    alt={author.full_name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <User className="size-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight">{author.full_name}</h3>
                {author.book_count != null && (
                  <p className="text-muted-foreground mt-1 text-xs">{author.book_count} kitob</p>
                )}
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

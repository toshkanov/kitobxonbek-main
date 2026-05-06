import { setRequestLocale, getTranslations } from "next-intl/server";
import { fetchAuthors } from "@/lib/api/books";
import { mapBackendAuthor } from "@/lib/mappers";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AuthorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("authors");

  let authors: ReturnType<typeof mapBackendAuthor>[] = [];

  try {
    const backendAuthors = await fetchAuthors();
    authors = backendAuthors.map(mapBackendAuthor);
  } catch {
    // ignore
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {authors.map((author) => (
          <Link key={author.id} href={`/authors/${author.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {author.photo && (
                    <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden">
                      <Image src={author.photo} alt={author.name} fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="font-semibold">{author.name}</h3>
                  {author.bookCount && (
                    <p className="text-sm text-muted-foreground">
                      {author.bookCount} {t("books")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

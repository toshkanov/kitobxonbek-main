import { setRequestLocale, getTranslations } from "next-intl/server";
import { fetchCollections } from "@/lib/api/books";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("collections");

  let collections: { id: string; title: string; slug: string; description: string; cover_image: string | null }[] = [];

  try {
    collections = await fetchCollections();
  } catch {
    // ignore
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              {collection.cover_image && (
                <div className="relative h-48">
                  <Image src={collection.cover_image} alt={collection.title} fill className="object-cover" />
                </div>
              )}
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold">{collection.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

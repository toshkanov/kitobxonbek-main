import { setRequestLocale, getTranslations } from "next-intl/server";
import { getLibrary } from "@/lib/api/library";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("library");

  let items: { id: string; book: { title: string; slug: string; short_description: string }; format: string; purchased_at: string }[] = [];

  try {
    items = await getLibrary();
  } catch {
    // ignore
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="size-16 mx-auto mb-4" />
          <p className="mb-4">{t("empty")}</p>
          <Link href="/books">
            <Button>{t("browseBooks")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-6">
              <h3 className="font-bold mb-2">{item.book.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.format}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {new Date(item.purchased_at).toLocaleDateString(locale)}
              </p>
              <div className="flex gap-2">
                <Link href={`/books/${item.book.slug}`}>
                  <Button variant="outline" size="sm">
                    {t("read")}
                  </Button>
                </Link>
                <Button size="sm">
                  <Download className="size-4 mr-1" />
                  {t("download")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

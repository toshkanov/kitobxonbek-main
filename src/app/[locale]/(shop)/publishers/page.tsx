import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { fetchPublishers } from "@/lib/api/books";
import type { BackendPublisher } from "@/lib/api/books";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export default async function PublishersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("publishers");

  let publishers: BackendPublisher[] = [];
  try {
    publishers = await fetchPublishers();
  } catch {
    // ignore
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {publishers.map((p) => (
          <Link key={p.id} href={`/publishers/${p.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  {p.logo ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted">
                      <Image src={p.logo} alt={p.name} fill className="object-contain p-2" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
                      {p.name[0]}
                    </div>
                  )}
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-snug">{p.name}</h3>
                    {!!p.book_count && (
                      <p className="text-sm text-muted-foreground">
                        {p.book_count} {t("books")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


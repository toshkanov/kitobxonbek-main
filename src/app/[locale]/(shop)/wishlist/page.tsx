import { setRequestLocale, getTranslations } from "next-intl/server";
import { getWishlist } from "@/lib/api/wishlist";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("wishlist");

  let items: { id: string; book_title: string; book_slug: string; book_price: string; book_image: string | null }[] = [];

  try {
    items = await getWishlist();
  } catch {
    // ignore
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="mb-4">{t("empty")}</p>
          <Link href="/books">
            <Button>{t("browseBooks")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              <Link href={`/books/${item.book_slug}`}>
                {item.book_image && (
                  <div className="relative aspect-[2/3]">
                    <Image src={item.book_image} alt={item.book_title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-2">{item.book_title}</h3>
                  <p className="text-sm font-bold mt-1">{formatPrice(parseFloat(item.book_price), locale)} so'm</p>
                </div>
              </Link>
              <div className="p-3 pt-0">
                <Button size="sm" className="w-full">
                  <ShoppingBag className="size-4 mr-1" />
                  {t("addToCart")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

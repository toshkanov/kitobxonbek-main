"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/stores/cart";
import { Link, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const { items, totalAmount, totalItems, isLoading, fetchCart, updateItemQuantity, removeItem, clear } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading && items.length === 0) {
    return <div className="container mx-auto px-4 py-20 text-center">{t("loading")}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="size-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">{t("empty")}</p>
        <Link href="/books">
          <Button>{t("browseBooks")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border rounded-lg p-4">
              <div className="relative w-20 h-28 rounded overflow-hidden shrink-0">
                {item.bookImage && (
                  <Image src={item.bookImage} alt={item.bookTitle} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <Link href={`/books/${item.bookSlug}`} className="font-semibold hover:underline">
                  {item.bookTitle}
                </Link>
                <p className="text-sm text-muted-foreground">{item.format}</p>
                <p className="font-bold mt-1">{formatPrice(item.price, locale)} so'm</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 ml-auto text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => clear()}>
            {t("clearCart")}
          </Button>
        </div>
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">{t("summary")}</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>{t("items")} ({totalItems})</span>
              <span>{formatPrice(totalAmount, locale)} so'm</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>{t("total")}</span>
              <span>{formatPrice(totalAmount, locale)} so'm</span>
            </div>
          </div>
          <Button className="w-full mt-4" size="lg" onClick={() => router.push("/checkout")}>
            {t("checkout")}
          </Button>
        </div>
      </div>
    </div>
  );
}

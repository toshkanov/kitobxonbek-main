"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { GlassBadge } from "@/components/glass";
import { RatingStars } from "./rating-stars";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Book } from "@/types";

interface BookCardProps {
  book: Book;
  className?: string;
  priority?: boolean;
}

export function BookCard({ book, className, priority }: BookCardProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);

  const defaultFormat =
    book.formats.find((f) => f.format === book.defaultFormat) ?? book.formats[0];
  const hasDiscount = !!defaultFormat.oldPrice && defaultFormat.oldPrice > defaultFormat.price;
  const discountPct = hasDiscount
    ? Math.round(((defaultFormat.oldPrice! - defaultFormat.price) / defaultFormat.oldPrice!) * 100)
    : 0;

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book.id, defaultFormat.format, 1);
    toast.success(`"${book.title}" savatga qo'shildi`);
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn("group relative flex flex-col", className)}
    >
      <Link href={`/books/${book.slug}`} className="flex flex-col gap-3">
        <div className="bg-muted relative aspect-[2/3] overflow-hidden rounded-xl">
          <Image
            src={book.coverImage || "/book-placeholder.svg"}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2">
              <GlassBadge tone="destructive">−{discountPct}%</GlassBadge>
            </span>
          )}
          <button
            type="button"
            aria-label="Sevimlilarga qo'shish"
            onClick={(e) => {
              e.preventDefault();
              toast.success("Sevimlilarga qo'shildi");
            }}
            className="glass absolute top-2 right-2 grid size-9 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Heart className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 px-0.5">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-xs">
            {book.authors.map((a) => a.name).join(", ")}
          </p>
          <RatingStars value={book.rating} showValue className="mt-0.5" />
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-base font-bold">
              {formatPrice(defaultFormat.price, locale)}
            </span>
            {hasDiscount && (
              <span className="text-muted-foreground text-xs line-through">
                {formatPrice(defaultFormat.oldPrice!, locale)}
              </span>
            )}
            <span className="text-muted-foreground text-xs">{t("soum")}</span>
          </div>
        </div>
      </Link>

      <Button
        variant="outline"
        size="sm"
        className="mt-3 w-full"
        onClick={onAddToCart}
      >
        <ShoppingBag className="mr-1.5 size-4" />
        {t("addToCart")}
      </Button>
    </motion.article>
  );
}

"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "./book-card";
import type { Book } from "@/types";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface BookCarouselProps {
  books: Book[];
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}

export function BookCarousel({ books, title, subtitle, viewAllHref }: BookCarouselProps) {
  const t = useTranslations("common");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden sm:inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t("viewAll")}
            </Link>
          )}
          <Button variant="outline" size="icon" onClick={() => scroll("left")} aria-label="Oldingi">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")} aria-label="Keyingi">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 scroll-smooth"
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="w-[160px] shrink-0 snap-start sm:w-[200px] md:w-[220px]"
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}

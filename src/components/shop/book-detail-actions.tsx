"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/types";

interface BookDetailActionsProps {
  book: Book;
}

export function BookDetailActions({ book }: BookDetailActionsProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [added, setAdded] = useState(false);

  const defaultFormat = book.formats.find((f) => f.format === book.defaultFormat) ?? book.formats[0];
  const available = defaultFormat?.isAvailable !== false;

  const handleAddToCart = async () => {
    if (!available) return;
    await addItem(book.id, book.defaultFormat ?? "paperback");
    setAdded(true);
    toast.success(`"${book.title}" savatga qo'shildi`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        className="flex-1"
        onClick={handleAddToCart}
        disabled={isLoading || !available || added}
      >
        {added ? (
          <>
            <Check className="size-4 mr-2" />
            Qo&apos;shildi
          </>
        ) : (
          <>
            <ShoppingBag className="size-4 mr-2" />
            {available ? "Savatga qoʻishish" : "Mavjud emas"}
          </>
        )}
      </Button>
    </div>
  );
}

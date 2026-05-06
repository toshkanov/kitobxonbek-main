"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { GlassBadge } from "@/components/glass";

export function CartButton() {
  const total = useCartStore((s) => s.totalItems);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Savat"
      className="relative"
      render={<Link href="/cart" />}
    >
      <ShoppingBag className="size-5" />
      <AnimatePresence>
        {total > 0 && (
          <motion.span
            key={total}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="absolute -top-1 -right-1"
          >
            <GlassBadge tone="primary">{total}</GlassBadge>
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

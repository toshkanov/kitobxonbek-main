"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface NewsFeedItemProps {
  children: ReactNode;
  index?: number;
  kicker?: string;
  badge?: string;
}

/**
 * News-style feed wrapper. Each item fades+rises into view as the user scrolls,
 * one after another, like a vertical news website.
 */
export function NewsFeedItem({ children, index = 0, kicker, badge }: NewsFeedItemProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "-80px 0px -80px 0px" }}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
        delay: Math.min(index * 0.04, 0.25),
      }}
      className="group relative scroll-mt-24"
    >
      {(kicker || badge) && (
        <div className="container mx-auto flex items-center gap-3 px-4 pt-2">
          {kicker && (
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.18em]">
              {kicker}
            </span>
          )}
          {badge && (
            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              {badge}
            </span>
          )}
          <div className="bg-border/60 ml-auto hidden h-px flex-1 sm:block" />
        </div>
      )}
      {children}
    </motion.article>
  );
}

interface NewsFeedDividerProps {
  label?: string;
}

export function NewsFeedDivider({ label }: NewsFeedDividerProps) {
  return (
    <div
      aria-hidden
      className="container mx-auto flex items-center gap-4 px-4 py-2 md:py-4"
    >
      <div className="from-border/0 via-border to-border/0 h-px flex-1 bg-gradient-to-r" />
      {label && (
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em]">
          {label}
        </span>
      )}
      <div className="from-border via-border to-border/0 h-px flex-1 bg-gradient-to-r" />
    </div>
  );
}

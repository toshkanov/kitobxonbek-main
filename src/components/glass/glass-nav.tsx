"use client";

import { useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassNavProps {
  children: ReactNode;
  className?: string;
  scrollThreshold?: number;
}

export function GlassNav({ children, className, scrollThreshold = 8 }: GlassNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > scrollThreshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollThreshold]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass-strong border-b border-border/40" : "bg-transparent",
        className,
      )}
    >
      {children}
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { CartButton } from "./cart-button";
import { SearchBar } from "./search-bar";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const tNav = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/75 supports-[backdrop-filter]:bg-background/55 border-border/40 border-b shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
            : "bg-background/40 supports-[backdrop-filter]:bg-background/20 border-b border-transparent backdrop-blur-xl",
        )}
      >
        {/* Subtle top accent line */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-3 md:h-[72px] md:gap-4">
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                aria-label="Menyu"
                className="rounded-xl"
              >
                <Menu className="size-5" />
              </Button>
            </div>

            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <span className="from-primary to-primary/70 text-primary-foreground grid size-9 place-items-center rounded-xl bg-gradient-to-br shadow-md shadow-black/5 transition-transform group-hover:scale-105">
                <BookOpen className="size-5" />
              </span>
              <span className="hidden text-lg font-bold tracking-tight sm:inline">
                Kitobxon
              </span>
            </Link>

            <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:gap-0">
              <MainNav />
            </nav>

            <div className="hidden flex-1 max-w-md md:flex md:ml-4 lg:ml-6">
              <SearchBar />
            </div>

            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={tNav("wishlist")}
                className="hidden rounded-xl sm:inline-flex"
                render={<Link href="/wishlist" />}
              >
                <Heart className="size-5" />
              </Button>
              <CartButton />
              <div className="bg-border/60 mx-1 hidden h-6 w-px sm:block" aria-hidden />
              <UserMenu />
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

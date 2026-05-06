"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, User, BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { CartButton } from "./cart-button";
import { SearchBar } from "./search-bar";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const tNav = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
          "sticky top-0 z-50 w-full transition-colors duration-200",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/40"
            : "bg-background/50 backdrop-blur-lg"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-4 md:h-[72px]">
            <div className="flex items-center gap-3 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                aria-label="Menyu"
              >
                <Menu className="size-5" />
              </Button>
            </div>

            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl">
                <BookOpen className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight hidden sm:inline">
                Kitobxon
              </span>
            </Link>

            <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:gap-0">
              <MainNav />
            </nav>

            <div className="hidden flex-1 max-w-md md:flex md:ml-6">
              <SearchBar />
            </div>

            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={tNav("wishlist")}
                className="hidden sm:inline-flex"
                render={<Link href="/wishlist" />}
              >
                <Heart className="size-5" />
              </Button>
              <CartButton />
              <Button
                variant="ghost"
                size="icon"
                aria-label={tNav("profile")}
                className="hidden sm:inline-flex"
                render={<Link href="/profile" />}
              >
                <User className="size-5" />
              </Button>
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

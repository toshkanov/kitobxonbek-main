"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { BookOpen, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchGenres } from "@/lib/api/books";
import type { BackendGenre } from "@/lib/api/books";
import { GenreDropdown } from "./genre-dropdown";
import { AuthorsDropdown } from "./authors-dropdown";
import { CollectionsDropdown } from "./collections-dropdown";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function NavLinks() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links: NavItem[] = [
    { label: t("books"), href: "/books", icon: BookOpen },
    { label: t("about"), href: "/about", icon: Info },
  ];

  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function MainNav() {
  const [genres, setGenres] = useState<BackendGenre[]>([]);
  const [genresLoading, setGenresLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchGenres()
      .then((data) => {
        if (!cancelled) {
          setGenres(data);
          setGenresLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setGenresLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex items-center">
      <GenreDropdown genres={genres} isLoading={genresLoading} />
      <AuthorsDropdown />
      <CollectionsDropdown />
      <NavLinks />
    </div>
  );
}

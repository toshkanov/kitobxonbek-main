"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Users, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchAuthors } from "@/lib/api/books";
import type { BackendAuthor } from "@/lib/api/books";

interface AuthorsDropdownProps {
  initialAuthors?: BackendAuthor[];
}

export function AuthorsDropdown({ initialAuthors }: AuthorsDropdownProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authors, setAuthors] = useState<BackendAuthor[]>(initialAuthors || []);
  const [isLoading, setIsLoading] = useState(!initialAuthors);

  useEffect(() => {
    if (!open || authors.length > 0 || isLoading) return;
    let cancelled = false;
    fetchAuthors()
      .then((data) => {
        if (!cancelled) {
          setAuthors(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, authors.length, isLoading]);

  const isActive = pathname.startsWith("/authors");
  const featuredAuthors = authors.filter((a) => a.is_featured).slice(0, 8);
  const displayAuthors =
    featuredAuthors.length > 0 ? featuredAuthors : authors.slice(0, 8);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive || open
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
            )}
          />
        }
      >
        <Users className="size-4 shrink-0" />
        {t("authors")}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 max-h-[min(400px,var(--available-height))] overflow-y-auto"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <Users className="size-4" />
          {t("authors")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : displayAuthors.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Mualliflar topilmadi
          </div>
        ) : (
          <DropdownMenuGroup>
            {displayAuthors.map((author) => (
              <DropdownMenuItem
                key={author.id}
                render={<Link href={`/authors/${author.slug}`} />}
                className="gap-2.5"
              >
                {author.photo ? (
                  <img
                    src={author.photo}
                    alt={author.full_name}
                    className="size-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-muted grid size-6 place-items-center rounded-full">
                    <Users className="size-3.5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{author.full_name}</span>
                  {author.nationality && (
                    <span className="text-xs text-muted-foreground">
                      {author.nationality}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/authors" />}
          className="text-primary"
        >
          <Users className="size-4" />
          <span>Barcha mualliflar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

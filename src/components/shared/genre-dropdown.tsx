"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BookOpen, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BackendGenre } from "@/lib/api/books";

interface GenreDropdownProps {
  genres: BackendGenre[];
  isLoading: boolean;
}

function GenreIcon({ icon }: { icon: string }) {
  if (icon && icon.trim()) {
    return <span className="text-base leading-none">{icon}</span>;
  }
  return <BookOpen className="size-4" />;
}

function hasChildren(genre: BackendGenre): boolean {
  return !!(genre.children && genre.children.length > 0);
}

function GenreItem({ genre }: { genre: BackendGenre }) {
  const childGenres = genre.children || [];

  if (hasChildren(genre)) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="gap-2.5">
          <GenreIcon icon={genre.icon} />
          <span>{genre.name}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-56">
          <DropdownMenuLabel>{genre.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {childGenres.map((child) => (
            <DropdownMenuItem
              key={child.id}
              render={<Link href={`/books?genres=${child.slug}`} />}
              className="gap-2.5"
            >
              <GenreIcon icon={child.icon} />
              <span>{child.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={<Link href={`/books?genres=${genre.slug}`} />}
            className="text-primary gap-2.5"
          >
            <BookOpen className="size-4" />
            <span>Barcha {genre.name} kitoblari</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuItem
      render={<Link href={`/books?genres=${genre.slug}`} />}
      className="gap-2.5"
    >
      <GenreIcon icon={genre.icon} />
      <span>{genre.name}</span>
    </DropdownMenuItem>
  );
}

export function GenreDropdown({ genres, isLoading }: GenreDropdownProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = pathname.startsWith("/genres");
  const parentGenres = genres.filter((g) => !g.parent);

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
        <BookOpen className="size-4 shrink-0" />
        {t("genres")}
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
          <BookOpen className="size-4" />
          {t("genres")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : parentGenres.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Janrlar topilmadi
          </div>
        ) : (
          <DropdownMenuGroup>
            {parentGenres.map((genre) => (
              <GenreItem key={genre.id} genre={genre} />
            ))}
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/genres" />}
          className="text-primary"
        >
          <BookOpen className="size-4" />
          <span>Barcha janrlar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

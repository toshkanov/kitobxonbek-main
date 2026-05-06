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
import { Layers, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchCollections } from "@/lib/api/books";
import type { BackendCollection } from "@/lib/api/books";

interface CollectionsDropdownProps {
  initialCollections?: BackendCollection[];
}

export function CollectionsDropdown({
  initialCollections,
}: CollectionsDropdownProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<BackendCollection[]>(
    initialCollections || []
  );
  const [isLoading, setIsLoading] = useState(!initialCollections);

  useEffect(() => {
    if (!open || collections.length > 0 || isLoading) return;
    let cancelled = false;
    fetchCollections()
      .then((data) => {
        if (!cancelled) {
          setCollections(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, collections.length, isLoading]);

  const isActive = pathname.startsWith("/collections");
  const displayCollections = collections.slice(0, 8);

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
        <Layers className="size-4 shrink-0" />
        {t("collections")}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-72 max-h-[min(400px,var(--available-height))] overflow-y-auto"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <Layers className="size-4" />
          {t("collections")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : displayCollections.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            To'plamlar topilmadi
          </div>
        ) : (
          <DropdownMenuGroup>
            {displayCollections.map((collection) => (
              <DropdownMenuItem
                key={collection.id}
                render={
                  <Link href={`/collections/${collection.slug}`} />
                }
                className="gap-3"
              >
                {collection.cover_image ? (
                  <img
                    src={collection.cover_image}
                    alt={collection.title}
                    className="size-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-muted grid size-10 place-items-center rounded-lg">
                    <Layers className="size-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-medium leading-tight">
                    {collection.title}
                  </span>
                  {collection.description && (
                    <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {collection.description}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/collections" />}
          className="text-primary"
        >
          <Layers className="size-4" />
          <span>Barcha to'plamlar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

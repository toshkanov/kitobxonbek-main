"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  BookOpen,
  Heart,
  ShoppingBag,
  User,
  X,
  ChevronDown,
  ChevronRight,
  Users,
  Layers,
  Info,
  Crown,
} from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { cn } from "@/lib/utils";
import { fetchGenres } from "@/lib/api/books";
import type { BackendGenre } from "@/lib/api/books";
import { GlassBadge } from "@/components/glass";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

function MobileNavItem({
  href,
  icon: Icon,
  label,
  badge,
  active,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-accent"
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && badge > 0 && <GlassBadge tone="primary">{badge}</GlassBadge>}
    </Link>
  );
}

function MobileCollapsibleSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        <Icon className="size-5 shrink-0" />
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>
      {expanded && (
        <div className="border-t border-border/50 bg-muted/20 px-2 py-2">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileGenreItem({
  genre,
  depth = 0,
  onClick,
}: {
  genre: BackendGenre;
  depth?: number;
  onClick?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!(genre.children && genre.children.length > 0);
  const childGenres = genre.children || [];

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
          depth > 0 ? "ml-4" : ""
        )}
      >
        <Link
          href={`/books?genres=${genre.slug}`}
          onClick={onClick}
          className="flex flex-1 items-center gap-2"
        >
          {genre.icon && genre.icon.trim() ? (
            <span className="text-sm leading-none">{genre.icon}</span>
          ) : (
            <BookOpen className="size-4 text-muted-foreground" />
          )}
          <span className="flex-1">{genre.name}</span>
        </Link>
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center size-6 rounded-md hover:bg-accent transition-colors"
          >
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-200",
                expanded && "rotate-90"
              )}
            />
          </button>
        )}
      </div>
      {expanded && hasChildren && (
        <div className="animate-in slide-in-from-top-1 duration-200">
          {childGenres.map((child) => (
            <MobileGenreItem key={child.id} genre={child} depth={depth + 1} onClick={onClick} />
          ))}
        </div>
      )}
    </div>
  );
}

function GenreSection({ onClick }: { onClick?: () => void }) {
  const t = useTranslations("nav");
  const [genres, setGenres] = useState<BackendGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchGenres()
      .then((data) => {
        if (!cancelled) {
          setGenres(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const parentGenres = genres.filter((g) => !g.parent);

  return (
    <MobileCollapsibleSection title={t("genres")} icon={BookOpen}>
      {isLoading ? (
        <div className="py-4 text-center text-xs text-muted-foreground">
          Yuklanmoqda...
        </div>
      ) : parentGenres.length === 0 ? (
        <div className="py-4 text-center text-xs text-muted-foreground">
          Janrlar topilmadi
        </div>
      ) : (
        <>
          {parentGenres.map((genre) => (
            <MobileGenreItem key={genre.id} genre={genre} onClick={onClick} />
          ))}
          <div className="pt-1 px-3">
            <Link
              href="/genres"
              onClick={onClick}
              className="flex items-center gap-2 text-xs font-medium text-primary hover:underline py-2"
            >
              <BookOpen className="size-3.5" />
              Barcha janrlar
            </Link>
          </div>
        </>
      )}
    </MobileCollapsibleSection>
  );
}

function AuthorsSection({ onClick }: { onClick?: () => void }) {
  const t = useTranslations("nav");

  return (
    <MobileCollapsibleSection title={t("authors")} icon={Users}>
      <Link
        href="/authors"
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
      >
        <Users className="size-4 text-muted-foreground" />
        Barcha mualliflar
      </Link>
    </MobileCollapsibleSection>
  );
}

function CollectionsSection({ onClick }: { onClick?: () => void }) {
  const t = useTranslations("nav");

  return (
    <MobileCollapsibleSection title={t("collections")} icon={Layers}>
      <Link
        href="/collections"
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
      >
        <Layers className="size-4 text-muted-foreground" />
        Barcha to&apos;plamlar
      </Link>
    </MobileCollapsibleSection>
  );
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={handleClose}
      />
      <div className="absolute inset-y-0 left-0 w-[min(320px,85vw)] bg-background shadow-xl animate-in slide-in-from-left duration-200 flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border/50">
          <Link href="/" onClick={handleClose} className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
              <BookOpen className="size-4" />
            </span>
            <span className="font-bold">Kitobxon</span>
          </Link>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-accent transition-colors"
            aria-label="Yopish"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <MobileNavItem
            href="/"
            icon={Home}
            label={t("home")}
            active={pathname === "/"}
            onClick={handleClose}
          />
          <MobileNavItem
            href="/books"
            icon={BookOpen}
            label={t("books")}
            active={pathname.startsWith("/books")}
            onClick={handleClose}
          />
          <MobileNavItem
            href="/wishlist"
            icon={Heart}
            label={t("wishlist")}
            active={pathname.startsWith("/wishlist")}
            onClick={handleClose}
          />
          <MobileNavItem
            href="/cart"
            icon={ShoppingBag}
            label={t("cart")}
            badge={totalItems}
            active={pathname.startsWith("/cart")}
            onClick={handleClose}
          />
          <MobileNavItem
            href="/orders"
            icon={Layers}
            label={t("orders")}
            active={pathname.startsWith("/orders")}
            onClick={handleClose}
          />
          <MobileNavItem
            href="/library"
            icon={BookOpen}
            label={t("library")}
            active={pathname.startsWith("/library")}
            onClick={handleClose}
          />
          <MobileNavItem
            href="/profile"
            icon={User}
            label={t("profile")}
            active={pathname.startsWith("/profile")}
            onClick={handleClose}
          />

          <div className="pt-4 space-y-2">
            <GenreSection onClick={handleClose} />
            <AuthorsSection onClick={handleClose} />
            <CollectionsSection onClick={handleClose} />
          </div>

          <div className="pt-4 space-y-1">
            <Link
              href="/tilla"
              onClick={handleClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                pathname.startsWith("/tilla")
                  ? "bg-amber-500 text-white"
                  : "text-amber-500 hover:bg-amber-500/10"
              )}
            >
              <Crown className="size-5 shrink-0" />
              <span className="flex-1">Tilla obuna</span>
            </Link>
            <MobileNavItem
              href="/about"
              icon={Info}
              label={t("about")}
              active={pathname.startsWith("/about")}
              onClick={handleClose}
            />
          </div>
        </div>

        <div className="border-t border-border/50 px-4 py-3 text-xs text-muted-foreground text-center">
          Kitobxon &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

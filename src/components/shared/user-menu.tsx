"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { LogIn, UserPlus, User as UserIcon, LogOut, BookMarked, Package, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth";

const subscribe = () => () => {};
const getHydrated = () => true;
const getHydratedServer = () => false;

export function UserMenu() {
  const tNav = useTranslations("nav");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useSyncExternalStore(subscribe, getHydrated, getHydratedServer);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!hydrated || !user) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/login" />}
          className="gap-1.5 text-sm font-medium"
        >
          <LogIn className="size-4" />
          {tNav("login")}
        </Button>
        <Button
          size="sm"
          render={<Link href="/register" />}
          className="gap-1.5 rounded-full px-4 text-sm font-semibold shadow-sm"
        >
          <UserPlus className="size-4" />
          {tNav("register")}
        </Button>
      </div>
    );
  }

  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={tNav("profile")}
            className="relative size-9 rounded-full p-0"
          />
        }
      >
        <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-full text-sm font-semibold">
          {initials}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold leading-none">
            {user.first_name} {user.last_name}
          </span>
          <span className="text-muted-foreground text-xs leading-none">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <UserIcon className="mr-2 size-4" />
          {tNav("profile")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/library")}>
          <BookMarked className="mr-2 size-4" />
          {tNav("library")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/orders")}>
          <Package className="mr-2 size-4" />
          {tNav("orders")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/wishlist")}>
          <Heart className="mr-2 size-4" />
          {tNav("wishlist")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          {tNav("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

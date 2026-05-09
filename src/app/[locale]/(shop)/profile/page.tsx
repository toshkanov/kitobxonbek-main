"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { User, Package, BookOpen, Heart, MapPin, Bell, Sparkles, BarChart3 } from "lucide-react";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">{t("loginRequired")}</p>
        <Link href="/login">
          <Button>{t("login")}</Button>
        </Link>
      </div>
    );
  }

  const menuItems = [
    { icon: Package, label: t("orders"), href: "/orders" },
    { icon: Heart, label: t("wishlist"), href: "/wishlist" },
    { icon: BookOpen, label: t("library"), href: "/library" },
    { icon: MapPin, label: t("addresses"), href: "/addresses" },
    { icon: Bell, label: t("notifications"), href: "/notifications" },
    { icon: Sparkles, label: t("recommendations"), href: "/recommendations" },
  ];

  if (user.role === "admin" || user.role === "staff") {
    menuItems.push({ icon: BarChart3, label: t("adminStats"), href: "/admin/stats" });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary text-primary-foreground grid size-16 place-items-center rounded-full">
          <User className="size-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.full_name || user.email}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {user.bonus_points > 0 && (
            <p className="text-sm text-primary">{user.bonus_points} bonus ball</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <item.icon className="size-6 mb-2 text-primary" />
              <span className="font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

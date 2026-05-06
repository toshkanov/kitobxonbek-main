"use client";

import { Search } from "lucide-react";
import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { GlassInput } from "@/components/glass";

interface SearchBarProps {
  className?: string;
  size?: "default" | "lg";
}

export function SearchBar({ className }: SearchBarProps) {
  const t = useTranslations("home.hero");
  const router = useRouter();
  const [value, setValue] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={onSubmit} className={className} role="search">
      <GlassInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("searchPlaceholder")}
        leftIcon={<Search className="size-4" />}
        aria-label="Qidirish"
      />
    </form>
  );
}

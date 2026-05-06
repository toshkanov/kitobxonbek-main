"use client";

import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { routing, type Locale } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const labels: Record<string, string> = { uz: "O'zbekcha", ru: "Русский", en: "English" };
const codes: Record<string, string> = { uz: "UZ", ru: "RU", en: "EN" };

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const change = (next: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            className="gap-2"
            aria-label="Tilni o'zgartirish"
          />
        }
      >
        <Languages className="size-4" />
        <span className="text-xs font-semibold">{codes[locale]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => change(l)}
            className={l === locale ? "font-semibold" : ""}
          >
            {labels[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

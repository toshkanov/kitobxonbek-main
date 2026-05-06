import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BookOpen } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const sections = [
    {
      title: t("company"),
      links: [
        { href: "/about", label: tNav("about") },
        { href: "/about#mission", label: "Bizning missiya" },
        { href: "/about#team", label: "Jamoa" },
      ],
    },
    {
      title: t("help"),
      links: [
        { href: "/help/delivery", label: "Yetkazib berish" },
        { href: "/help/payment", label: "To'lov" },
        { href: "/help/returns", label: "Qaytarish" },
        { href: "/help/contact", label: "Bog'lanish" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: "/legal/terms", label: "Foydalanish shartlari" },
        { href: "/legal/privacy", label: "Maxfiylik siyosati" },
        { href: "/legal/offer", label: "Ommaviy oferta" },
      ],
    },
  ];

  return (
    <footer className="border-border/40 bg-card/30 mt-24 border-t backdrop-blur-sm">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl">
              <BookOpen className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">Kitobxon</span>
          </Link>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Kitoblar olamiga sayohat. Minglab kitoblar, mualliflar va janrlar bir joyda.
          </p>
        </div>

        {sections.map((s) => (
          <div key={s.title}>
            <h3 className="mb-3 text-sm font-semibold tracking-tight">{s.title}</h3>
            <ul className="space-y-2">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-border/40 border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Kitobxon. {t("rights")}.</p>
          <p>Made in Uzbekistan</p>
        </div>
      </div>
    </footer>
  );
}

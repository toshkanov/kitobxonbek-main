import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MOCK_COLLECTIONS } from "@/lib/mock-data";

export function CollectionsSection() {
  const t = useTranslations("home.sections");

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
        {t("collections")}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {MOCK_COLLECTIONS.map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <Image
              src={c.cover}
              alt={c.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 text-white">
              <p className="text-xs font-medium opacity-80">{c.bookCount} kitob</p>
              <h3 className="mt-1 flex items-center gap-1.5 text-xl font-bold tracking-tight">
                {c.title}
                <ArrowUpRight className="size-5 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
              <p className="mt-1 line-clamp-2 text-sm opacity-90">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

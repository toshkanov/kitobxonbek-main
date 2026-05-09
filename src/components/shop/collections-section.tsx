import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { fetchCollections } from "@/lib/api/books";

const FALLBACK_COVERS = [
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
];

export async function CollectionsSection() {
  const t = await getTranslations("home.sections");

  let collections: Awaited<ReturnType<typeof fetchCollections>> = [];
  try {
    collections = await fetchCollections();
  } catch {
    // ignore
  }

  if (collections.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t("collections")}</h2>
        <Link href="/collections" className="text-sm text-primary hover:underline">
          Barchasi →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {collections.map((c, idx) => (
          <Link
            key={c.id}
            href={`/collections/${c.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <Image
              src={c.cover_image || FALLBACK_COVERS[idx % FALLBACK_COVERS.length]}
              alt={c.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 text-white">
              <h3 className="mt-1 flex items-center gap-1.5 text-xl font-bold tracking-tight">
                {c.title}
                <ArrowUpRight className="size-5 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
              {c.description && (
                <p className="mt-1 line-clamp-2 text-sm opacity-90">{c.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

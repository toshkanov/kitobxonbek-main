import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/glass";
import { MOCK_AUTHORS } from "@/lib/mock-data";

export function FeaturedAuthorsSection() {
  const t = useTranslations("home.sections");

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
        {t("featuredAuthors")}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {MOCK_AUTHORS.map((author) => (
          <Link key={author.id} href={`/authors/${author.slug}`} className="group">
            <GlassCard
              variant="soft"
              className="flex flex-col items-center gap-3 p-5 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="bg-muted relative size-20 overflow-hidden rounded-full">
                {author.photo && (
                  <Image
                    src={author.photo}
                    alt={author.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight">{author.name}</h3>
                <p className="text-muted-foreground mt-1 text-xs">{author.bookCount} kitob</p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

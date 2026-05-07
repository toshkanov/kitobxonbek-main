import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/shop/hero-section";
import { GenresSection } from "@/components/shop/genres-section";
import { BookCarousel } from "@/components/shop/book-carousel";
import { CollectionsSection } from "@/components/shop/collections-section";
import { FeaturedAuthorsSection } from "@/components/shop/featured-authors";
import { TestimonialsSection } from "@/components/shop/testimonials-section";
import { NewsletterSection } from "@/components/shop/newsletter-section";
import { NewsFeedItem, NewsFeedDivider } from "@/components/shop/news-feed";
import { fetchBestsellers, fetchNewArrivals } from "@/lib/api/books";
import { mapBackendBook } from "@/lib/mappers";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.sections");

  let bestsellers: ReturnType<typeof mapBackendBook>[] = [];
  let newArrivals: ReturnType<typeof mapBackendBook>[] = [];

  try {
    const [bestsellersData, newArrivalsData] = await Promise.all([
      fetchBestsellers(),
      fetchNewArrivals(),
    ]);
    bestsellers = bestsellersData.map(mapBackendBook);
    newArrivals = newArrivalsData.map(mapBackendBook);
  } catch {
    // If API fails, render without books — sections that depend on data are skipped.
  }

  return (
    <div className="flex flex-col">
      <NewsFeedItem index={0}>
        <HeroSection />
      </NewsFeedItem>

      <NewsFeedDivider label="Janrlar" />
      <NewsFeedItem index={1} kicker="Yo'nalishlar" badge="Top">
        <GenresSection />
      </NewsFeedItem>

      {bestsellers.length > 0 && (
        <>
          <NewsFeedDivider label="Bestseller" />
          <NewsFeedItem index={2} kicker="Eng ko'p sotilganlar" badge="Hit">
            <BookCarousel
              books={bestsellers}
              title={t("bestsellers")}
              viewAllHref="/books?sort=popular"
            />
          </NewsFeedItem>
        </>
      )}

      {newArrivals.length > 0 && (
        <>
          <NewsFeedDivider label="Yangi" />
          <NewsFeedItem index={3} kicker="Endigina kelgan" badge="Yangi">
            <BookCarousel
              books={newArrivals}
              title={t("newArrivals")}
              viewAllHref="/books?sort=newest"
            />
          </NewsFeedItem>
        </>
      )}

      <NewsFeedDivider label="To'plamlar" />
      <NewsFeedItem index={4} kicker="Tematik tanlov">
        <CollectionsSection />
      </NewsFeedItem>

      <NewsFeedDivider label="Mualliflar" />
      <NewsFeedItem index={5} kicker="Tanlangan ovozlar">
        <FeaturedAuthorsSection />
      </NewsFeedItem>

      <NewsFeedDivider label="Sharhlar" />
      <NewsFeedItem index={6} kicker="O'quvchilar fikri">
        <TestimonialsSection />
      </NewsFeedItem>

      <NewsFeedDivider label="Yangiliklar" />
      <NewsFeedItem index={7} kicker="Aloqada qoling" badge="Newsletter">
        <NewsletterSection />
      </NewsFeedItem>
    </div>
  );
}

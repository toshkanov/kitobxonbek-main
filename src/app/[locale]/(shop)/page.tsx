import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/shop/hero-section";
import { GenresSection } from "@/components/shop/genres-section";
import { BookCarousel } from "@/components/shop/book-carousel";
import { CollectionsSection } from "@/components/shop/collections-section";
import { FeaturedAuthorsSection } from "@/components/shop/featured-authors";
import { TestimonialsSection } from "@/components/shop/testimonials-section";
import { NewsletterSection } from "@/components/shop/newsletter-section";
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
    // If API fails, render without books
  }

  return (
    <>
      <HeroSection />
      <GenresSection />
      {bestsellers.length > 0 && (
        <BookCarousel
          books={bestsellers}
          title={t("bestsellers")}
          viewAllHref="/books?sort=popular"
        />
      )}
      {newArrivals.length > 0 && (
        <BookCarousel
          books={newArrivals}
          title={t("newArrivals")}
          viewAllHref="/books?sort=newest"
        />
      )}
      <CollectionsSection />
      <FeaturedAuthorsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}

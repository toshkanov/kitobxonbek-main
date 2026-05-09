import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GenreSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Keep legacy /genres/:slug route working by redirecting
  // to the canonical books filter route.
  redirect(`/books?genres=${encodeURIComponent(slug)}`);
}


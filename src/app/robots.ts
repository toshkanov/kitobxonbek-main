import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/profile", "/orders", "/library", "/wishlist", "/addresses", "/notifications", "/settings"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

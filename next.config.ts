import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8000/api/v1/:path*",
      },
    ];
  },
  async redirects() {
    return [
      // Root redirect to default locale
      {
        source: "/",
        destination: "/uz",
        permanent: false,
      },
      // Legacy genre detail URLs used by the home page mock genres.
      {
        source: "/:locale/genres/:slug",
        destination: "/:locale/books?genres=:slug",
        permanent: false,
      },
      {
        source: "/genres/:slug",
        destination: "/books?genres=:slug",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

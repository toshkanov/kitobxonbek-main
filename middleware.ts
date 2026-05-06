import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_SEGMENTS = ["/profile", "/orders", "/library", "/wishlist", "/addresses", "/notifications", "/settings"];
const ADMIN_SEGMENTS = ["/admin"];

function stripLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && (routing.locales as readonly string[]).includes(parts[0])) {
    return "/" + parts.slice(1).join("/");
  }
  return pathname;
}

export default function middleware(request: NextRequest) {
  const path = stripLocale(request.nextUrl.pathname);
  const accessToken = request.cookies.get("access_token")?.value;

  const isProtected = PROTECTED_SEGMENTS.some((s) => path.startsWith(s));
  const isAdmin = ADMIN_SEGMENTS.some((s) => path.startsWith(s));

  if ((isProtected || isAdmin) && !accessToken) {
    const loginUrl = new URL(`/${routing.defaultLocale}/login`, request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

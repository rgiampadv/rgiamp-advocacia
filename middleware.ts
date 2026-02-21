import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const supportedLocales = routing.locales as readonly string[];
const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && !supportedLocales.includes(firstSegment)) {
    const rest = segments.slice(1).join("/");
    const newPath = `/pt${rest ? `/${rest}` : ""}${request.nextUrl.search}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  if (!sessionCookie && !req.nextUrl.pathname.startsWith("/sign-in")) {
    const url = new URL("/sign-in", req.nextUrl.origin);

    const { pathname, hash, search } = req.nextUrl;
    url.searchParams.set("callbackURL", `${pathname}${hash}${search}`);

    return NextResponse.redirect(url);
  }

  const headers = new Headers(req.headers);
  const nextUrlKeys = [
    "basePath",
    "href",
    "origin",
    "hostname",
    "pathname",
    "hash",
    "search",
  ] as const;
  nextUrlKeys.map((k) => headers.set(`x-nextUrl-${k}`, req.nextUrl[k]));

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/sign-in",
    "/dashboard/:path*",

    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  if (!sessionCookie && !req.nextUrl.pathname.startsWith("/sign-in")) {
    const { pathname, hash, search } = req.nextUrl;
    const callbackURL = `${pathname}${hash}${search}`;
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackURL", callbackURL);
    return NextResponse.redirect(url);
  }

  // if (sessionCookie && req.nextUrl.pathname.startsWith("/sign-in"))
  //   return NextResponse.redirect(new URL("/dashboard", req.url));

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

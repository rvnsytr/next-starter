import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { allRequestMetaKey } from "./core/constants/metadata";

export function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  if (!sessionCookie && !req.nextUrl.pathname.startsWith("/sign-in"))
    return NextResponse.redirect(new URL("/sign-in", req.url));

  if (sessionCookie && req.nextUrl.pathname.startsWith("/sign-in"))
    return NextResponse.redirect(new URL("/dashboard", req.url));

  const headers = new Headers(req.headers);
  allRequestMetaKey.map((k) => headers.set(`x-${k}`, req.nextUrl[k]));

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

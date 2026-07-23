import { Route } from "next";

export const appConfig = {
  name: "Next Starter",
  description:
    "Personalized Next.js 16 starter template bundled with my go-to tools and configs for kickstarting new projects.",

  keywords: ["next", "next starter"] as string[],

  logo: {
    default: "/logo.png",
    withText: "/logo-text.png",
  },

  default: {
    language: "id",

    /** @see [route.ts](../../core/route.ts) / createSignInURL */
    get callbackUrls(): Route[] {
      return ["/", "/dashboard"];
    },

    /** @see [s3.ts](../../core/s3.ts) */
    fileDirectory: "global",
  },
} as const;

import { Route } from "next";

export const appConfig = {
  name: "Next Starter",
  description: "App description...",
  keywords: ["next", "next starter"] as string[],

  logo: {
    default: "/logo.png",
    withText: "/logo-text.png",
  },

  default: {
    language: "id",

    /** @see [route.ts](../../core/route.ts) / createSignInURL */
    callbackUrls: ["/", "/dashboard"] satisfies Route[] as Route[],

    /** @see [s3.ts](../../core/s3.ts) */
    fileDirectory: "global",
  },
} as const;

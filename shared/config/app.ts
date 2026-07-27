import { Route } from "next";
import { FileVisibility } from "../db/types";

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

    /** @see [s3.ts](../../core/s3/utils.ts) */
    s3FileDirectory: "global",

    /** @see [s3.ts](../../core/s3/utils.ts) */
    get s3FileVisibility(): FileVisibility {
      return "private";
    },
  },
} as const;

import { FileVisibility } from "@/core/s3";
import { Route } from "next";

const callbackUrls: Route[] = ["/", "/dashboard"];
const s3FileVisibility: FileVisibility = "private";

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
    callbackUrls,

    /** @see [s3.ts](../../core/s3/utils.ts) */
    s3FileDirectory: "global",

    /** @see [s3.ts](../../core/s3/utils.ts) */
    s3FileVisibility,
  },
} as const;

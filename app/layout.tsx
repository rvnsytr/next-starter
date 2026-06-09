import { GridPattern } from "@/core/components/ui/grid-pattern";
import {
  AnchoredToastProvider,
  ToastProvider,
} from "@/core/components/ui/toast";
import { GlobalShortcuts } from "@/core/providers/global-shortcuts";
import { cn } from "@/core/utils";
import { LoadingFallback } from "@/shared/components/fallback";
import { appConfig } from "@/shared/config";
import "@/styles/globals.css";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import z from "zod";
import { id } from "zod/locales";

z.config(id());

const fontSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
  keywords: appConfig.keywords,
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={appConfig.default.language}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={cn(fontSans.variable, fontMono.variable, "relative")}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <ToastProvider>
              <AnchoredToastProvider>
                <main className="relative isolate flex min-h-svh flex-col">
                  <GridPattern className="stroke-muted/60 dark:stroke-muted/20" />
                  <Suspense
                    fallback={
                      <LoadingFallback
                        variant="orbit"
                        className="size-6"
                        containerClassName="min-h-svh"
                      />
                    }
                  >
                    {children}
                  </Suspense>
                </main>

                <GlobalShortcuts />
              </AnchoredToastProvider>
            </ToastProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

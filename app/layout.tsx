import { GridPattern } from "@/core/components/ui/grid-pattern";
import {
  AnchoredToastProvider,
  ToastProvider,
} from "@/core/components/ui/toast";
import { appConfig } from "@/shared/configs";
import { GlobalShortcuts } from "@/shared/providers/global-shortcuts";
import "@/styles/globals.css";
import { cn } from "cn";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import z from "zod";
import { en } from "zod/locales";

z.config(en());

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
                  {children}
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

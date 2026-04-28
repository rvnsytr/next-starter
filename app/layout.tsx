import { GridPattern } from "@/core/components/ui/grid-pattern";
import {
  AnchoredToastProvider,
  ToastProvider,
} from "@/core/components/ui/toast";
import { DynamicBreadcrumbProvider } from "@/core/providers/dynamic-breadcrumb";
import { GlobalShortcuts } from "@/core/providers/global-shortcuts";
import { cn } from "@/core/utils";
import { appConfig } from "@/shared/config";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={appConfig.defaultLanguage}
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
                <DynamicBreadcrumbProvider>
                  <main className="relative isolate flex min-h-svh flex-col">
                    <GridPattern className="stroke-muted/60 dark:stroke-muted/20" />
                    {children}
                  </main>

                  <GlobalShortcuts />
                </DynamicBreadcrumbProvider>
              </AnchoredToastProvider>
            </ToastProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

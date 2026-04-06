import { appMeta } from "@/config/app";
import { GridPattern } from "@/core/components/ui/grid-pattern";
import {
  AnchoredToastProvider,
  ToastProvider,
} from "@/core/components/ui/toast";
import { GlobalShortcuts } from "@/core/providers/global-shortcuts";
import { cn } from "@/core/utils/helpers";
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
  title: appMeta.name,
  description: appMeta.description,
  keywords: appMeta.keywords,
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
    <html lang={appMeta.defaultLanguage} suppressHydrationWarning>
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

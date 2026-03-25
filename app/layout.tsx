import { Toaster } from "@/core/components/ui/sonner";
import { appMeta } from "@/core/constants/app";
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

const fontHeading = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: "600",
});

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
    <html lang={appMeta.lang} suppressHydrationWarning>
      <body
        className={cn(
          fontHeading.variable,
          fontSans.variable,
          fontMono.variable,
          "relative",
        )}
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            {/* <GridPattern className="stroke-muted dark:stroke-muted/60 -z-10 min-h-dvh" /> */}

            <div className="relative isolate flex min-h-svh flex-col">
              {children}
            </div>

            <Toaster position="top-center" closeButton richColors />

            <GlobalShortcuts />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

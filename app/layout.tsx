import { GridPattern } from "@/core/components/ui/grid-pattern";
import { Toaster } from "@/core/components/ui/sonner";
import { appMeta } from "@/core/constants";
import { GlobalShortcuts } from "@/core/providers/global-shortcuts";
import { cn } from "@/core/utils";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";

const sansFont = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const monoFont = Geist_Mono({
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
      <body className={cn(sansFont.variable, monoFont.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <GridPattern className="stroke-muted dark:stroke-muted/60 -z-1 min-h-dvh" />
          {children}
          <Toaster position="top-center" closeButton richColors />
          <GlobalShortcuts />
        </ThemeProvider>
      </body>
    </html>
  );
}

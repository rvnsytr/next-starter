import { auth } from "@/core/auth";
import { FooterNote } from "@/core/components/layout/footer-note";
import {
  SidebarApp,
  SidebarAppSiteHeader,
} from "@/core/components/layout/sidebar";
import { LoadingFallback } from "@/core/components/ui/fallback";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import {
  allLayoutMode,
  LayoutModeProvider,
} from "@/core/providers/layout-mode";
import { authorizedRoute, getRouteTitle } from "@/core/route";
import { AuthProvider } from "@/modules/auth/provider";
import { Metadata } from "next";
import { cookies, headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import z from "zod";

export const metadata: Metadata = { title: getRouteTitle("/dashboard") };

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <Suspense
      fallback={
        <LoadingFallback
          variant="orbit"
          className="size-6"
          containerClassName="min-h-svh"
        />
      }
    >
      <DashboardAuthProvider>
        <DashboardLayoutMode className="[--header-height:calc(--spacing(14))]">
          <SidebarProvider className="flex flex-col">
            <SidebarAppSiteHeader />

            <div className="flex flex-1">
              <SidebarApp />

              <SidebarInset>
                {children}
                <footer className="bg-background/90 z-10 mt-auto flex items-center justify-center border-t py-4 text-center md:h-12.5">
                  <FooterNote className="container" />
                </footer>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </DashboardLayoutMode>
      </DashboardAuthProvider>
    </Suspense>
  );
}

async function DashboardAuthProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });

  const pathname = headers.get("x-pathname");
  if (!session || !authorizedRoute(pathname, session.user.role))
    return notFound();

  return <AuthProvider session={session}>{children}</AuthProvider>;
}

async function DashboardLayoutMode({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const layoutPreference = z
    .enum(allLayoutMode)
    .catch("centered")
    .parse(cookieStore.get("layout-preference")?.value);

  return (
    <LayoutModeProvider layout={layoutPreference} className={className}>
      {children}
    </LayoutModeProvider>
  );
}

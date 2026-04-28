import { FooterNote } from "@/core/components/layout/footer-note";
import {
  SidebarApp,
  SidebarAppSiteHeader,
} from "@/core/components/layout/sidebar";
import { LoadingFallback } from "@/core/components/ui/fallback";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import { allLayoutMode, LayoutProvider } from "@/core/providers/layout";
import { authorizedRoute, getRouteTitle } from "@/core/route";
import { getSession } from "@/modules/auth/actions";
import { AuthProvider } from "@/modules/auth/provider";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
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
      <DashboardAuth>
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
      </DashboardAuth>
    </Suspense>
  );
}

async function DashboardAuth({ children }: { children?: React.ReactNode }) {
  const req = await headers();
  const session = await getSession();

  const pathname = req.get("x-pathname");
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
    <LayoutProvider layout={layoutPreference} className={className}>
      {children}
    </LayoutProvider>
  );
}

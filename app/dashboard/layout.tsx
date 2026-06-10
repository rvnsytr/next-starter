import { auth } from "@/core/auth";
import { SidebarApp, SidebarAppSiteHeader } from "@/core/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import { DynamicBreadcrumbProvider } from "@/core/providers/dynamic-breadcrumb";
import { LayoutModeProvider } from "@/core/providers/layout-mode";
import {
  authorizedRoute,
  createSignInURL,
  getRequestUrl,
  getRouteTitle,
} from "@/core/route";
import { AuthProvider } from "@/modules/auth/provider";
import { FooterNote } from "@/shared/components/footer-note";
import { allLayoutMode } from "@/shared/config";
import { Metadata } from "next";
import { cookies, headers as nextHeaders } from "next/headers";
import { notFound, redirect } from "next/navigation";
import z from "zod";

export const metadata: Metadata = { title: getRouteTitle("/dashboard") };

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <DashboardAuthProvider>
      <DashboardLayoutMode className="[--header-height:calc(--spacing(12))] lg:[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <DynamicBreadcrumbProvider>
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
          </DynamicBreadcrumbProvider>
        </SidebarProvider>
      </DashboardLayoutMode>
    </DashboardAuthProvider>
  );
}

async function DashboardAuthProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const headers = await nextHeaders();
  const reqUrl = getRequestUrl(headers);

  const session = await auth.api.getSession({ headers });
  if (!session) redirect(createSignInURL(reqUrl));

  const isAuthorized = authorizedRoute(reqUrl.pathname, session.user.role);
  if (!isAuthorized) return notFound();

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

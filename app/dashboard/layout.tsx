import { getRequestMeta } from "@/core/actions";
import { FooterNote } from "@/core/components/layout/footer-note";
import { SidebarMain } from "@/core/components/layout/sidebar-main";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import { LayoutProvider } from "@/core/providers/layout";
import { authorizedRoute, getRouteTitle } from "@/core/route";
import { getSession } from "@/modules/auth/actions";
import { AuthProvider } from "@/modules/auth/provider.auth";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: getRouteTitle("/dashboard") };

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await getSession();
  const { pathname } = await getRequestMeta();

  if (!session || !authorizedRoute(pathname, session.user.role))
    return notFound();

  return (
    <AuthProvider session={session}>
      <SidebarProvider>
        <SidebarMain />

        <SidebarInset>
          <LayoutProvider>{children}</LayoutProvider>
          <footer className="bg-background/90 z-10 mt-auto flex items-center justify-center border-t py-4 text-center md:h-12.5">
            <FooterNote className="container" />
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}

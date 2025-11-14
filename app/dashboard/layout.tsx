import { Tagline } from "@/components/layouts/sections";
import { SidebarMain } from "@/components/layouts/sidebar-main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutProvider } from "@/providers/layout";
import { getSession } from "@/server/action";
import { getTitle } from "@/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SWRConfig } from "swr";

export const metadata: Metadata = { title: getTitle("/dashboard") };

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await getSession();
  if (!session) notFound();
  return (
    <SWRConfig value={{ fallback: { session } }}>
      <SidebarProvider>
        <SidebarMain data={session.user} />

        <SidebarInset>
          <LayoutProvider>{children}</LayoutProvider>

          <footer className="bg-background/90 z-10 mt-auto flex items-center justify-center border-t py-4 text-center md:h-12.5">
            <Tagline className="container" />
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </SWRConfig>
  );
}

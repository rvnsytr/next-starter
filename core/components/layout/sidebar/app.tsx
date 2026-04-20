import { Sidebar, SidebarRail } from "@/core/components/ui/sidebar";
import { SidebarAppContent } from "./content";
import { SidebarAppFooter } from "./footer";
import { SidebarAppHeader } from "./header";

export function SidebarApp() {
  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarAppHeader />
      <SidebarAppContent />
      <SidebarAppFooter />
      <SidebarRail />
    </Sidebar>
  );
}

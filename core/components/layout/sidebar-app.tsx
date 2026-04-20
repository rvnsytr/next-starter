import { Sidebar, SidebarRail } from "@/core/components/ui/sidebar";
import { SidebarAppContent } from "./sidebar-app-content";
import { SidebarAppFooter } from "./sidebar-app-footer";
import { SidebarAppHeader } from "./sidebar-app-header";

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

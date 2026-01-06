import { dashboardfooterMenu } from "@/core/constants";
import { SignOutButton, StopImpersonateUserMenuItem } from "@/modules/auth";
import Link from "next/link";
import { RefreshButton } from "../ui/buttons.client";
import {
  Sidebar,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "../ui/sidebar";
import { LinkSpinner } from "../ui/spinner";
import { SidebarMainContent, SidebarMainHeader } from "./sidebar-main.client";

export function SidebarMain() {
  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarMainHeader />

      {/* Content */}
      <SidebarMainContent />

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Refresh Page" asChild>
              <RefreshButton
                size="xs"
                variant="ghost"
                className="justify-start text-xs"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>

          {dashboardfooterMenu.map(
            ({ route, displayName, icon: Icon, disabled }) => {
              const iconElement = Icon && <Icon />;
              return (
                <SidebarMenuItem key={route}>
                  {disabled ? (
                    <SidebarMenuButton size="sm" disabled>
                      {iconElement} {displayName}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton size="sm" tooltip={displayName} asChild>
                      <Link href={route}>
                        <LinkSpinner icon={{ base: iconElement }} />
                        {displayName}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            },
          )}

          <SidebarSeparator />

          <StopImpersonateUserMenuItem />

          <SidebarMenuItem>
            <SignOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

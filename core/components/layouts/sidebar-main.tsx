import { dashboardfooterMenu } from "@/core/constants";
import { SignOutButton } from "@/modules/auth";
import Link from "next/link";
import { RefreshButton } from "../ui/buttons.client";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "../ui/sidebar";
import { LinkSpinner } from "../ui/spinner";
import {
  SidebarAppContent,
  SidebarAppHeader,
  SidebarCommandPallete,
} from "./sidebar-main.client";

export function SidebarMain() {
  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarAppHeader />
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="mb-2" />

        <SidebarCommandPallete />
      </SidebarHeader>

      {/* Content */}
      <SidebarAppContent />

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
            ({ url, displayName, icon: Icon, disabled }) => {
              const iconElement = Icon && <Icon />;
              return (
                <SidebarMenuItem key={url}>
                  {disabled ? (
                    <SidebarMenuButton size="sm" disabled>
                      {iconElement} {displayName}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton size="sm" tooltip={displayName} asChild>
                      <Link href={url}>
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

          <SidebarMenuItem>
            <SignOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

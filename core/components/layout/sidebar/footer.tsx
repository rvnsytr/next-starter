"use client";

import { Kbd } from "@/core/components/ui/kbd";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/core/components/ui/sidebar";
import { LinkSpinner } from "@/core/components/ui/spinner";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { StopImpersonateUserMenuItem } from "@/modules/auth/components/stop-impersonate-user-button";
import { routeConfig } from "@/shared/config/route";
import { menuConfig } from "@/shared/menu";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import Link from "next/link";

export function SidebarAppFooter() {
  return (
    <SidebarFooter>
      <SidebarMenu className="gap-2">
        {menuConfig["dashboard-footer"].map(
          ({ route, icon: Icon, disabled, shortcut }) => {
            const iconElement = Icon && <Icon />;
            const { title } = routeConfig[route];

            return (
              <SidebarMenuItem key={route}>
                {disabled ? (
                  <SidebarMenuButton size="sm" disabled>
                    {iconElement} {title}
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    size="sm"
                    tooltip={title}
                    render={
                      <Link href={route}>
                        <LinkSpinner icon={{ base: iconElement }} /> {title}
                        {shortcut && (
                          <Kbd className="ml-auto hidden lg:inline-flex">
                            {formatForDisplay(shortcut)}
                          </Kbd>
                        )}
                      </Link>
                    }
                  />
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
  );
}

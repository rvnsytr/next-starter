"use client";

import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { StopImpersonateUserMenuItem } from "@/modules/auth/components/stop-impersonate-user-button";
import { menuConfig, routeConfig } from "@/shared/configs";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import Link from "next/link";
import { Kbd } from "../ui/kbd";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { LinkSpinner } from "../ui/spinner";

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
                            {shortcut.map((k) => formatForDisplay(k)).join("+")}
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

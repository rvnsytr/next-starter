"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/core/components/ui/sidebar";
import { getMenuByRole } from "@/core/route";
import { UserVerifiedBadge } from "@/modules/auth/components/user-verified-badge";
import { useAuth } from "@/modules/auth/provider";
import { menuConfig } from "@/shared/menu";
import Link from "next/link";
import { useMemo } from "react";
import { QuickSearch } from "../../quick-search";

export function SidebarAppHeader() {
  const { user } = useAuth();
  const menu = useMemo(
    () => getMenuByRole(menuConfig.dashboard, user.role),
    [user.role],
  );

  return (
    <SidebarHeader>
      <SidebarMenu className="flex lg:hidden">
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="group/head-button h-13 group-data-[collapsible=icon]:my-2.5 group-data-[collapsible=icon]:p-0"
            render={<Link href="/dashboard/profile" />}
          >
            <Avatar className="rounded-md *:rounded-md after:rounded-md">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              <AvatarBadge className="bg-success" />
            </Avatar>

            <div className="grid break-all">
              <div className="flex gap-x-2 truncate">
                <span className="line-clamp-1 text-sm font-medium tracking-tight">
                  {user.name}
                </span>

                {user.emailVerified && (
                  <UserVerifiedBadge classNames={{ icon: "size-3.5" }} />
                )}
              </div>

              <span className="text-muted-foreground line-clamp-1 text-xs">
                {user.email}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarSeparator className="flex lg:hidden" />

      <QuickSearch
        type="group-menu"
        data={menu}
        className="mt-2"
        shortcuts={["Control+K"]}
      />
    </SidebarHeader>
  );
}

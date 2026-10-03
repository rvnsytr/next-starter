"use client";

import { getAccessibleMenus } from "@/core/route";
import { stopImpersonateUser } from "@/modules/auth/actions";
import { signOutClient } from "@/modules/auth/components/sign-out-button";
import { UserVerifiedBadge } from "@/modules/auth/components/user-verified-badge";
import { useSession } from "@/modules/auth/hooks/use-session";
import { DASHBOARD_FOOTER_MENU, DASHBOARD_MENU } from "@/shared/configs";
import { Layers2Icon, LogOutIcon } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  QuickSearch,
  QuickSearchDataGroup,
  QuickSearchItem,
} from "../quick-search";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";

export function SidebarAppHeader() {
  const router = useRouter();
  const { user, session } = useSession();

  const data: QuickSearchDataGroup = useMemo(() => {
    const actionItems: QuickSearchItem[] = [
      {
        type: "action",
        label: "Sign out",
        // TODO: variant: "destructive",
        icon: <LogOutIcon />,
        callback: () =>
          signOutClient({ onSuccess: (url) => router.push(url as Route) }),
      },
    ];

    if (session.impersonatedBy)
      actionItems.unshift({
        type: "action",
        label: "Back to my account",
        icon: <Layers2Icon />,
        callback: stopImpersonateUser,
      });

    return [
      ...getAccessibleMenus(DASHBOARD_MENU, user.role),
      { group: "Navigation", items: DASHBOARD_FOOTER_MENU },
      { group: "Actions", items: actionItems },
    ];
  }, [router, user.role, session.impersonatedBy]);

  return (
    <SidebarHeader>
      <SidebarMenu className="flex lg:hidden">
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="group/head-button h-13 group-data-[collapsible=icon]:my-2.5 group-data-[collapsible=icon]:p-0"
            render={<Link href="/dashboard/profile" />}
          >
            <Avatar radius="md">
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
        type="group"
        data={data}
        shortcut={["Control+K"]}
        className="mt-2"
      />
    </SidebarHeader>
  );
}

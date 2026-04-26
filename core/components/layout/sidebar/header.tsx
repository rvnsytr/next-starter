"use client";

import {
  QuickSearch,
  QuickSearchDataGroup,
} from "@/core/components/quick-search";
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
import { signOutClient } from "@/modules/auth/components/sign-out-button";
import { UserVerifiedBadge } from "@/modules/auth/components/user-verified-badge";
import { useSession } from "@/modules/auth/provider";
import { menuConfig } from "@/shared/menu";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function SidebarAppHeader() {
  const router = useRouter();
  const { user } = useSession();

  const data: QuickSearchDataGroup = useMemo(() => {
    return [
      ...getMenuByRole(menuConfig.dashboard, user.role),
      { group: "Navigasi", items: menuConfig["dashboard-footer"] },
      {
        group: "Aksi",
        items: [
          {
            type: "action",
            label: "Keluar",
            // TODO: variant: "destructive",
            icon: <LogOutIcon />,
            callback: () =>
              signOutClient({ onSuccess: () => router.push("/sign-in") }),
          },
        ],
      },
    ];
  }, [router, user.role]);

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
        shortcuts={["Control+K"]}
        className="mt-2"
      />
    </SidebarHeader>
  );
}

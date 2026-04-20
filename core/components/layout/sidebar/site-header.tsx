"use client";

import { DynamicBreadcrumb } from "@/core/components/dynamic-breadcrumb";
import { LayoutToggle } from "@/core/components/layout";
import { ThemeToggle } from "@/core/components/theme";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Separator } from "@/core/components/ui/separator";
import { ShimmerText } from "@/core/components/ui/shimmer-text";
import { SidebarToggle } from "@/core/components/ui/sidebar";
import { useAuth } from "@/modules/auth/provider";
import { appConfig } from "@/shared/config";
import Link from "next/link";

export function SidebarAppSiteHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <div className="flex h-(--header-height) items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-x-2">
          <SidebarToggle align="start" />
          <Separator orientation="vertical" className="h-4" />
          <Link
            href="/dashboard"
            className="mx-2 font-mono text-sm font-medium tracking-tight"
          >
            <ShimmerText className="text-sm font-bold">
              {appConfig.name}
            </ShimmerText>
          </Link>

          <DynamicBreadcrumb className="hidden md:flex" />
        </div>

        <div className="flex items-center gap-x-2">
          {/* <ImpersonateUserBadge /> */}
          <LayoutToggle />
          <ThemeToggle align="end" />

          <Separator orientation="vertical" className="mr-2 h-4" />

          <Link href="/dashboard/profile">
            <Avatar className="rounded-md *:rounded-md after:rounded-md">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              <AvatarBadge className="bg-success" />
            </Avatar>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto border-b px-4 py-2 **:text-xs md:hidden">
        <DynamicBreadcrumb />
      </div>
    </header>
  );
}

import { DynamicBreadcrumb } from "@/core/components/dynamic-breadcrumb";
import { LayoutToggle } from "@/core/components/layout";
import { ThemeToggle } from "@/core/components/theme";
import { Separator } from "@/core/components/ui/separator";
import { ShimmerText } from "@/core/components/ui/shimmer-text";
import { SidebarToggle } from "@/core/components/ui/sidebar";
import { ImpersonateUserBadge } from "@/modules/auth/components/impersonate-user-badge";
import { appConfig } from "@/shared/config";
import Link from "next/link";
import { SidebarAppSiteHeaderAvatar } from "./site-header-avatar";

export function SidebarAppSiteHeader() {
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
          <ImpersonateUserBadge />
          <LayoutToggle />
          <ThemeToggle align="end" />

          <Separator orientation="vertical" className="mr-2 h-4" />

          <Link href="/dashboard/profile">
            <SidebarAppSiteHeaderAvatar />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto border-b px-4 py-2 **:text-xs md:hidden">
        <DynamicBreadcrumb />
      </div>
    </header>
  );
}

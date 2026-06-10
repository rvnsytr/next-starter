import { ImpersonateUserBadge } from "@/modules/auth/components/impersonate-user-badge";
import { appConfig } from "@/shared/config";
import Link from "next/link";
import { DynamicBreadcrumb } from "../dynamic-breadcrumb";
import { LayoutModeToggle } from "../layout-mode";
import { ThemeToggle } from "../theme";
import { Separator } from "../ui/separator";
import { ShimmerText } from "../ui/shimmer-text";
import { SidebarToggle } from "../ui/sidebar";
import { SidebarAppSiteHeaderAvatar } from "./site-header-avatar";

export function SidebarAppSiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-60 w-full">
      <div className="flex h-(--header-height) items-center justify-between gap-2 border-b px-2 lg:px-4">
        <div className="flex items-center gap-x-2">
          <SidebarToggle align="start" />
          <Separator orientation="vertical" className="h-4" />
          <Link
            href="/dashboard"
            className="mx-2 font-mono text-sm font-medium tracking-tight"
          >
            <ShimmerText>{appConfig.name}</ShimmerText>
          </Link>

          <DynamicBreadcrumb className="hidden md:flex" fallback />
        </div>

        <div className="flex items-center gap-x-2">
          <ImpersonateUserBadge />
          <LayoutModeToggle withTooltip />
          <ThemeToggle align="end" />

          <Separator orientation="vertical" className="h-4" />

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

import { cn } from "@/core/utils";
import { ImpersonateUserBadge } from "@/modules/auth";
import { ReactNode } from "react";
import { LayoutButton, ThemeButton } from "../ui/buttons.client";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../ui/dynamic-breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Spinner } from "../ui/spinner";

export function DashboardMain({
  className,
  children,
  ...props
}: DynamicBreadcrumbProps & { className?: string; children?: ReactNode }) {
  return (
    <>
      <nav className="bg-background/90 sticky top-0 z-50 flex items-center justify-between gap-x-4 border-b p-4 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger align="start" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb {...props} />
        </div>

        <div className="flex items-center gap-x-2">
          <ImpersonateUserBadge />
          <LayoutButton />
          <ThemeButton align="end" />
        </div>
      </nav>

      <Spinner
        data-slot="dashboard-main-loader"
        variant="frame"
        className={cn(
          "hidden group-data-[layout-mode=unset]/layout-mode:flex",
          "m-auto size-5",
        )}
      />

      <div
        data-slot="dashboard-main"
        className={cn(
          "flex group-data-[layout-mode=unset]/layout-mode:hidden",
          "relative z-10 flex-1 flex-col gap-4 py-4",
          "px-4 group-data-[layout-mode=centered]/layout-mode:container",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}

import { cn } from "@/core/utils/helpers";
import { ImpersonateUserBadge } from "@/modules/auth/components.client";
import { ReactNode } from "react";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../ui/dynamic-breadcrumb";
import { LayoutToggle } from "../ui/layout";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Spinner } from "../ui/spinner";
import { ThemeToggle } from "../ui/theme";

export function DashboardMain({
  withLayoutLoader = true,
  className,
  children,
  ...props
}: DynamicBreadcrumbProps & {
  withLayoutLoader?: boolean;
  className?: string;
  children?: ReactNode;
}) {
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
          <LayoutToggle />
          <ThemeToggle align="end" />
        </div>
      </nav>

      <Spinner
        data-slot="dashboard-main-loader"
        variant="frame"
        className={cn(
          "m-auto hidden size-5",
          !withLayoutLoader &&
            "group-data-[layout-mode=unset]/layout-mode:flex",
        )}
      />

      <div
        data-slot="dashboard-main"
        className={cn(
          "relative z-10 flex flex-1 flex-col gap-4 py-4",
          "px-4 group-data-[layout-mode=centered]/layout-mode:container",
          !withLayoutLoader &&
            "group-data-[layout-mode=unset]/layout-mode:hidden",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}

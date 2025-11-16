import { ReactNode } from "react";
import { LayoutButton, ThemeButton } from "../ui/buttons.client";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../ui/dynamic-breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { DashboardMainContent } from "./dashboard.client";

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
          <LayoutButton />
          <ThemeButton align="end" />
        </div>
      </nav>

      <DashboardMainContent className={className}>
        {children}
      </DashboardMainContent>
    </>
  );
}

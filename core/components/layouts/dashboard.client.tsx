"use client";

import { useLayout } from "@/core/providers";
import { cn } from "@/core/utils";
import { Spinner } from "../ui/spinner";

export function DashboardMainContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { layout } = useLayout();
  return layout ? (
    <div
      className={cn(
        "relative z-10 flex flex-1 flex-col gap-4 py-4",
        layout === "fullwidth" ? "px-4" : "container",
        className,
      )}
    >
      {children}
    </div>
  ) : (
    <div className="flex flex-1 items-center justify-center p-4">
      <Spinner variant="frame" className="size-5" />
    </div>
  );
}

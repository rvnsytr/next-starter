// ? Sync with [Card Component](../ui/card.tsx)

import { cn } from "@/core/utils";

export function DashboardPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dashboard-page"
      className={cn(
        "group/dashboard-page relative z-10 flex flex-1 flex-col gap-4 p-4",
        className,
      )}
      {...props}
    />
  );
}

export function DashboardPageHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="dashboard-page-header"
      className={cn(
        "group/dashboard-page-header @container/dashboard-page-header grid auto-rows-min items-start gap-1 has-data-[slot=dashboard-page-action]:grid-cols-[1fr_auto] has-data-[slot=dashboard-page-description]:grid-rows-[auto_auto] [.border-b]:pb-4",
        "px-4 lg:px-0",
        className,
      )}
      {...props}
    />
  );
}

export function DashboardPageTitle({
  as: Comp = "h1",
  className,
  ...props
}: React.ComponentProps<"h1"> & { as?: "h1" | "h2" | "h3" }) {
  return (
    <Comp
      data-slot="dashboard-page-title"
      className={cn(
        "flex items-center gap-2 text-base leading-tight font-semibold **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function DashboardPageDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dashboard-page-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm text-pretty *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

export function DashboardPageAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dashboard-page-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

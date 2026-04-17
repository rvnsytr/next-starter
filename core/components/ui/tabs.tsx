"use client";

import { cn } from "@/core/utils";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

export type TabsVariant = "default" | "line";

export function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        "flex flex-col gap-2 data-[orientation=vertical]:flex-row",
        className,
      )}
      {...props}
    />
  );
}

export function TabsList({
  variant = "default",
  className,
  children,
  ...props
}: TabsPrimitive.List.Props & { variant?: TabsVariant }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5",
        "data-[orientation=vertical]:flex-col",
        variant === "default"
          ? "bg-muted text-muted-foreground/72 rounded-lg p-1"
          : "*:data-[slot=tabs-tab]:hover:bg-accent data-[orientation=horizontal]:py-1 data-[orientation=vertical]:px-1",
        className,
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        data-slot="tab-indicator"
        className={cn(
          "absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out",
          variant === "line"
            ? "bg-primary z-10 data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:translate-y-px data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:-translate-x-px"
            : "bg-background dark:bg-input -z-1 rounded-md shadow-sm/5",
        )}
      />
    </TabsPrimitive.List>
  );
}

export function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        "hover:text-muted-foreground focus-visible:ring-ring data-active:text-foreground relative flex h-7 shrink-0 grow cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-[calc(--spacing(2.5)-1px)] text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none focus-visible:ring-2 data-disabled:pointer-events-none data-disabled:opacity-64 data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start **:[svg]:pointer-events-none **:[svg]:-mx-0.5 **:[svg]:shrink-0 **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

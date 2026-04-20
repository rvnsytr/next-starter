// ? Sync with [Card Component](../ui/card.tsx)

import { cn } from "@/core/utils";

export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-container"
      className={cn(
        "relative z-10 flex flex-1 flex-col gap-4 p-4 md:group-data-[layout-mode=centered]/layout-mode:container",
        className,
      )}
      {...props}
    />
  );
}

export function PageHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "group/page-header @container/page-header grid auto-rows-min items-start gap-1 has-data-[slot=page-action]:grid-cols-[1fr_auto] has-data-[slot=page-description]:grid-rows-[auto_auto] [.border-b]:pb-4",
        className,
      )}
      {...props}
    />
  );
}

export function PageTitle({
  as: Comp = "h1",
  className,
  ...props
}: React.ComponentProps<"h1"> & { as?: "h1" | "h2" | "h3" }) {
  return (
    <Comp
      data-slot="page-title"
      className={cn(
        "flex items-center gap-2 text-base leading-tight font-semibold **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function PageDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm text-pretty *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

export function PageAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

// ? Sync with [Card Component](../ui/card.tsx)

import { cn } from "cn";

export function ContentLayout({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-layout"
      className={cn(
        "group/content-layout relative flex flex-1 flex-col gap-4 p-4",
        className,
      )}
      {...props}
    />
  );
}

export function ContentLayoutHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="content-layout-header"
      className={cn(
        "group/content-layout-header @container/content-layout-header grid auto-rows-min items-start gap-1 px-4 has-data-[slot=content-layout-action]:grid-cols-[1fr_auto] has-data-[slot=content-layout-description]:grid-rows-[auto_auto] [.border-b]:pb-4",
        className,
      )}
      {...props}
    />
  );
}

export function ContentLayoutTitle({
  as: Comp = "h1",
  className,
  ...props
}: React.ComponentProps<"h1"> & { as?: "h1" | "h2" | "h3" }) {
  return (
    <Comp
      data-slot="content-layout-title"
      className={cn(
        "flex items-center gap-2 text-base leading-tight font-semibold **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function ContentLayoutDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="content-layout-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm text-pretty *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

export function ContentLayoutAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-layout-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

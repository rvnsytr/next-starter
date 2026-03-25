import { cn } from "@/core/utils/helpers";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";

export function Page({
  withLayoutLoader = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  withLayoutLoader?: boolean;
}) {
  return (
    <>
      <div
        className={cn(
          "hidden size-full items-center justify-center",
          withLayoutLoader && "group-data-[layout-mode=unset]/layout-mode:flex",
        )}
      >
        <Spinner data-slot="page-loader" variant="frame" className="size-5" />
      </div>

      <div
        data-slot="page"
        className={cn(
          "relative z-10 flex flex-1 flex-col gap-4 py-4",
          "px-4 md:group-data-[layout-mode=centered]/layout-mode:container",
          withLayoutLoader &&
            "group-data-[layout-mode=unset]/layout-mode:hidden",
          className,
        )}
        {...props}
      />
    </>
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
        "group/page-header @container/page-header grid auto-rows-min items-start gap-1 has-data-[slot=page-action]:grid-cols-[1fr_auto] has-data-[slot=page-description]:grid-rows-[auto_auto]",
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
        "text-base leading-normal font-medium **:[svg:not([class*='size-'])]:size-4",
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
      className={cn("text-muted-foreground text-sm", className)}
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

export function PageCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="page-card"
      className={cn(
        "scroll-m-20 rounded-none **:data-[slot=card-content]:px-4 md:rounded-lg **:data-[slot=card-content]:md:px-6 **:data-[slot=card-content]:md:group-data-[size=sm]/card:px-4",
        className,
      )}
      {...props}
    />
  );
}

import { cn } from "@/core/utils";

export type TableVariant = "default" | "card";

export function Table({
  variant = "default",
  containerClassName,
  className,
  ...props
}: React.ComponentProps<"table"> & {
  variant?: TableVariant;
  containerClassName?: string;
}) {
  return (
    <div
      data-slot="table-container"
      data-variant={variant}
      className={cn("relative w-full overflow-x-auto", containerClassName)}
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-0",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("**:[tr]:border-b", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "in-data-[variant=card]:*:[tr]:*:[td]:bg-card relative before:pointer-events-none before:absolute before:inset-px before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] not-in-data-[variant=card]:before:hidden in-data-[variant=card]:rounded-xl in-data-[variant=card]:shadow-xs/5 dark:before:shadow-[0_-1px_--theme(--color-white/8%)] in-data-[variant=card]:*:[tr]:border-0 in-data-[variant=card]:*:[tr]:*:[td]:border-b in-data-[variant=card]:*:[tr]:first:*:[td]:first:rounded-ss-xl in-data-[variant=card]:*:[tr]:*:[td]:first:border-s in-data-[variant=card]:*:[tr]:first:*:[td]:border-t in-data-[variant=card]:*:[tr]:last:*:[td]:last:rounded-ee-xl in-data-[variant=card]:*:[tr]:*:[td]:last:border-e in-data-[variant=card]:*:[tr]:first:*:[td]:last:rounded-se-xl in-data-[variant=card]:*:[tr]:last:*:[td]:first:rounded-es-xl in-data-[variant=card]:*:[tr]:hover:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] in-data-[variant=card]:*:[tr]:data-[state=selected]:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_4%)] dark:in-data-[variant=card]:*:[tr]:hover:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)] dark:in-data-[variant=card]:*:[tr]:data-[state=selected]:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_4%)] **:[tr:last-child]:border-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-transparent font-medium not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] in-data-[variant=card]:border-none dark:not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)] [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "relative border-b not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-black)_2%)] not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-black)_4%)] dark:not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-white)_2%)] dark:not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-white)_4%)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-muted-foreground h-10 px-2.5 text-left align-middle leading-none font-medium whitespace-nowrap has-[[role=checkbox]]:w-px first:has-[[role=checkbox]]:pe-0 last:has-[[role=checkbox]]:ps-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "bg-clip-padding p-2.5 align-middle leading-none whitespace-nowrap in-data-[slot=table-footer]:py-3.5 in-data-[variant=card]:first:ps-[calc(--spacing(2.5)-1px)] in-data-[variant=card]:last:pe-[calc(--spacing(2.5)-1px)] has-[[role=checkbox]]:w-px first:has-[[role=checkbox]]:pe-0 last:has-[[role=checkbox]]:ps-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "text-muted-foreground mt-4 text-sm in-data-[variant=card]:my-4",
        className,
      )}
      {...props}
    />
  );
}

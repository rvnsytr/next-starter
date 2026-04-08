"use client";

import { cn } from "@/core/utils/helpers";

export function Label({
  asCard = false,
  className,
  ...props
}: React.ComponentProps<"label"> & { asCard?: boolean }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        asCard &&
          "hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50 items-start rounded-lg border p-3",
        className,
      )}
      {...props}
    />
  );
}

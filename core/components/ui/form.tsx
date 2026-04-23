"use client";

import { cn } from "@/core/utils";

export function Form({
  className,
  noValidate = true,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      data-slot="form"
      className={cn(
        "flex w-full flex-col gap-x-2 gap-y-4",

        // Card gap
        "group-data-[size=sm]/card:has-data-[slot=card-content]:has-data-[slot=card-footer]:gap-3",
        // CardContent, DialogPanel
        "**:[[data-slot=card-content],[data-slot=dialog-panel]]:flex **:[[data-slot=card-content],[data-slot=dialog-panel]]:flex-col **:[[data-slot=card-content],[data-slot=dialog-panel]]:gap-4",
        // CardFooter
        "**:data-[slot=card-footer]:flex-col **:data-[slot=card-footer]:items-stretch md:**:data-[slot=card-footer]:flex-row",

        className,
      )}
      noValidate={noValidate}
      {...props}
    />
  );
}

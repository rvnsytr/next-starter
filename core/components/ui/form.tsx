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
      className={cn("flex w-full flex-col gap-x-2 gap-y-4", className)}
      noValidate={noValidate}
      {...props}
    />
  );
}

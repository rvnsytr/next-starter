"use client";

import { cn } from "@/core/utils";
import { Form as FormPrimitive } from "@base-ui/react/form";

export function Form({ className, ...props }: FormPrimitive.Props) {
  return (
    <FormPrimitive
      data-slot="form"
      className={cn("flex w-full flex-col gap-x-2 gap-y-4", className)}
      {...props}
    />
  );
}

export { FormPrimitive };

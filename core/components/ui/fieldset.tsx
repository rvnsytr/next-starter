"use client";

import { cn } from "@/core/utils";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";

export function Fieldset({
  className,
  ...props
}: FieldsetPrimitive.Root.Props) {
  return (
    <FieldsetPrimitive.Root
      data-slot="fieldset"
      className={cn("flex w-full flex-col gap-x-2 gap-y-4", className)}
      {...props}
    />
  );
}
export function FieldsetLegend({
  className,
  ...props
}: FieldsetPrimitive.Legend.Props) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="fieldset-legend"
      className={cn(
        "text-foreground flex items-center gap-2 leading-tight font-semibold **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

"use client";

import { cn } from "@/core/utils/helpers";
import { Field as FieldPrimitive } from "@base-ui/react/field";

export function Field({
  invalid,
  className,
  ...props
}: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      invalid={invalid}
      className={cn(
        "group/field flex flex-col items-start gap-2",
        "has-required:**:[[data-slot=field-label],[data-slot=label]]:after:text-destructive-foreground has-required:**:[[data-slot=field-label],[data-slot=label]]:after:content-['*']",
        invalid &&
          "**:[[data-slot=field-label],[data-slot=label]]:text-destructive-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function FieldLabel({
  asCard = false,
  className,
  ...props
}: FieldPrimitive.Label.Props & { asCard?: boolean }) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "text-foreground inline-flex items-center gap-2 text-sm/4 font-medium data-disabled:opacity-64",
        asCard &&
          "hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50 items-start rounded-lg border p-3",
        className,
      )}
      {...props}
    />
  );
}

export function FieldItem({ className, ...props }: FieldPrimitive.Item.Props) {
  return (
    <FieldPrimitive.Item
      data-slot="field-item"
      className={cn("flex", className)}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  ...props
}: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn("text-destructive-foreground text-xs", className)}
      {...props}
    />
  );
}

export const FieldControl: typeof FieldPrimitive.Control =
  FieldPrimitive.Control;
export const FieldValidity: typeof FieldPrimitive.Validity =
  FieldPrimitive.Validity;

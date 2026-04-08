"use client";

import { cn } from "@/core/utils/helpers";
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "lucide-react";
import { createContext, useContext, useId } from "react";
import { Label } from "./label";

export const NumberFieldContext = createContext<{ fieldId: string } | null>(
  null,
);

export function NumberField({
  id,
  className,
  size = "default",
  ...props
}: NumberFieldPrimitive.Root.Props & {
  size?: "sm" | "default" | "lg";
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <NumberFieldContext.Provider value={{ fieldId }}>
      <NumberFieldPrimitive.Root
        id={fieldId}
        data-slot="number-field"
        data-size={size}
        className={cn("flex w-full flex-col items-start gap-2", className)}
        {...props}
      />
    </NumberFieldContext.Provider>
  );
}

export function NumberFieldGroup({
  className,
  ...props
}: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(
        "border-input bg-background text-foreground ring-ring/24 focus-within:border-ring has-aria-invalid:border-destructive/36 has-autofill:bg-foreground/4 focus-within:has-aria-invalid:border-destructive/64 focus-within:has-aria-invalid:ring-destructive/48 dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 relative flex w-full justify-between rounded-lg border text-sm shadow-xs/5 transition-shadow not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-data-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-within:ring-[3px] data-disabled:pointer-events-none data-disabled:opacity-64 dark:not-data-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] [[data-disabled],:focus-within,[aria-invalid]]:shadow-none **:[svg]:pointer-events-none **:[svg]:shrink-0 **:[svg:not([class*='size-'])]:size-4",
        "*:last: *:first:rounded-s-[calc(var(--radius-lg)-1px)] *:last:rounded-e-[calc(var(--radius-lg)-1px)]",
        className,
      )}
      {...props}
    />
  );
}

export function NumberFieldDecrement({
  className,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      className={cn(
        "hover:bg-accent relative flex shrink-0 cursor-pointer items-center justify-center px-[calc(--spacing(3)-1px)] transition-colors in-data-[size=sm]:px-[calc(--spacing(2.5)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
        className,
      )}
      {...props}
    >
      <MinusIcon />
    </NumberFieldPrimitive.Decrement>
  );
}

export function NumberFieldIncrement({
  className,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      className={cn(
        "hover:bg-accent relative flex shrink-0 cursor-pointer items-center justify-center px-[calc(--spacing(3)-1px)] transition-colors in-data-[size=sm]:px-[calc(--spacing(2.5)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
        className,
      )}
      {...props}
    >
      <PlusIcon />
    </NumberFieldPrimitive.Increment>
  );
}

export function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(
        "h-7.5 w-full min-w-0 grow bg-transparent px-[calc(--spacing(3)-1px)] text-center leading-7.5 tabular-nums outline-none [transition:background-color_5000000s_ease-in-out_0s] in-data-[size=lg]:h-8.5 in-data-[size=lg]:leading-8.5 in-data-[size=sm]:h-6.5 in-data-[size=sm]:px-[calc(--spacing(2.5)-1px)] in-data-[size=sm]:leading-8.5",
        className,
      )}
      {...props}
    />
  );
}

export function NumberFieldScrubArea({
  className,
  label,
  ...props
}: NumberFieldPrimitive.ScrubArea.Props & { label: string }) {
  const context = useContext(NumberFieldContext);

  if (!context)
    throw new Error(
      "NumberFieldScrubArea must be used within a NumberField component.",
    );

  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn("flex cursor-ew-resize", className)}
      {...props}
    >
      <Label htmlFor={context.fieldId} className="cursor-ew-resize">
        {label}
      </Label>
      <NumberFieldPrimitive.ScrubAreaCursor className="cursor-nesw-resize drop-shadow-[0_1px_1px_#0008] filter">
        <CursorGrowIcon />
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  );
}

function CursorGrowIcon({ ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="black"
      height="14"
      stroke="white"
      viewBox="0 0 24 14"
      width="26"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  );
}

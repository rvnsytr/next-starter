"use client";

import { cn } from "@/core/utils/helpers";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { mergeProps } from "@base-ui/react/merge-props";

export type TextareaProps = React.ComponentPropsWithoutRef<"textarea"> &
  React.RefAttributes<HTMLTextAreaElement> & {
    size?: "sm" | "default" | "lg" | number;
    unstyled?: boolean;
  };

export function Textarea({
  ref,
  size = "default",
  unstyled = false,
  className,
  ...props
}: TextareaProps) {
  return (
    <span
      data-slot="textarea-control"
      data-size={size}
      className={cn(
        !unstyled &&
          "border-input bg-background text-foreground ring-ring/24 has-focus-visible:has-aria-invalid:border-destructive has-focus-visible:has-aria-invalid:ring-destructive/20 has-aria-invalid:border-destructive/50 has-focus-visible:border-ring dark:bg-input/32 dark:has-aria-invalid:ring-destructive/40 has-focus-visible:ring-ring/50 relative inline-flex w-full rounded-lg border text-sm shadow-xs/5 transition-shadow not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:ring-[3px] has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
    >
      <FieldPrimitive.Control
        ref={ref}
        id={props.id}
        name={props.name}
        value={props.value}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        render={(defaultProps: React.ComponentProps<"textarea">) => (
          <textarea
            data-slot="textarea"
            className={cn(
              "field-sizing-content min-h-17.5 w-full rounded-[inherit] px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] outline-none max-sm:min-h-20.5",
              size === "sm" &&
                "min-h-16.5 px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1)-1px)] max-sm:min-h-19.5",
              size === "lg" &&
                "min-h-18.5 py-[calc(--spacing(2)-1px)] max-sm:min-h-21.5",
            )}
            {...mergeProps(defaultProps, props)}
          />
        )}
      />
    </span>
  );
}

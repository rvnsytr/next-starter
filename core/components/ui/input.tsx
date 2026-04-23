"use client";

import { cn } from "@/core/utils";
import { Input as InputPrimitive } from "@base-ui/react/input";

export type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  "size"
> & {
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
  nativeInput?: boolean;
};

export function Input({
  size = "default",
  unstyled = false,
  nativeInput = false,
  style,
  className,
  ...props
}: InputProps) {
  const inputClassName = cn(
    "h-8 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] leading-8 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72",
    size === "sm" && "h-7 px-[calc(--spacing(2.5)-1px)] leading-7",
    size === "lg" && "h-9 leading-9",
    props.type === "search" &&
      "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
    props.type === "file" &&
      "text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
  );

  return (
    <span
      data-size={size}
      data-slot="input-control"
      className={cn(
        !unstyled &&
          "border-input bg-background text-foreground ring-ring/24 has-focus-visible:has-aria-invalid:border-destructive has-focus-visible:has-aria-invalid:ring-destructive/20 has-aria-invalid:border-destructive/50 has-focus-visible:border-ring has-autofill:bg-foreground/4 dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/40 has-focus-visible:ring-ring/50 relative inline-flex w-full rounded-lg border text-sm shadow-xs/5 transition-shadow not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:ring-[3px] has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
    >
      {nativeInput ? (
        <input
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          style={typeof style === "function" ? undefined : style}
          className={inputClassName}
          {...props}
        />
      ) : (
        <InputPrimitive
          data-slot="input"
          style={style}
          size={typeof size === "number" ? size : undefined}
          className={inputClassName}
          {...props}
        />
      )}
    </span>
  );
}

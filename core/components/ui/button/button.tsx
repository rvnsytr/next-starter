"use client";

import { cn } from "@/core/utils";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  // ? based on: coss/ui
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent font-medium text-sm outline-none transition-shadow active:not-aria-[haspopup]:translate-y-px before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 **:[svg:not([class*='opacity-'])]:opacity-80 **:[svg:not([class*='size-'])]:size-4 **:[svg]:pointer-events-none **:[svg]:-mx-0.5 **:[svg]:shrink-0",
  {
    // ? based on: shadcn/ui
    variants: {
      size: {
        xl: "h-10 px-[calc(--spacing(4)-1px)] text-base **:[svg:not([class*='size-'])]:size-4.5",
        lg: "h-9 px-[calc(--spacing(3.5)-1px)]",
        default: "h-8 px-[calc(--spacing(3)-1px)]",
        sm: "h-7 gap-1.5 px-[calc(--spacing(2.5)-1px)]",
        xs: "h-6 gap-1 rounded-md px-[calc(--spacing(2)-1px)] before:rounded-[calc(var(--radius-md)-1px)] text-xs **:[svg:not([class*='size-'])]:size-3.5",

        "icon-xl": "size-10 **:[svg:not([class*='size-'])]:size-4.5",
        "icon-lg": "size-9",
        icon: "size-8",
        "icon-sm": "size-7",
        "icon-xs":
          "size-6 rounded-md before:rounded-[calc(var(--radius-md)-1px)] not-in-data-[slot=input-group]:**:[svg:not([class*='size-'])]:size-3.5",
      },
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        link: "relative text-primary no-underline after:bg-primary after:absolute after:bottom-px after:h-px after:w-2/4 after:origin-bottom-right after:scale-x-0 after:transition-transform after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",

        success:
          "bg-success text-white hover:bg-success/80 focus-visible:border-success/40 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        "success-soft":
          "bg-success/10 text-success hover:bg-success/20 focus-visible:border-success/40 focus-visible:ring-success/20 dark:bg-success/20 dark:hover:bg-success/30 dark:focus-visible:ring-success/40",
        "success-outline":
          "text-success border-success/30 bg-background shadow-xs hover:border-success/50 dark:bg-success/5 hover:bg-success/5 dark:hover:border-success/60 dark:hover:bg-success/15 aria-expanded:border-success aria-expanded:bg-success/5 dark:aria-expanded:bg-success/15 focus-visible:border-success/40 focus-visible:bg-success/5 dark:focus-visible:bg-success/15 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        "success-ghost":
          "text-success hover:bg-success/5 dark:hover:bg-success/15 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 focus-visible:border-success/40",

        warning:
          "bg-warning text-white hover:bg-warning/80 focus-visible:border-warning/40 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        "warning-soft":
          "bg-warning/10 text-warning hover:bg-warning/20 focus-visible:border-warning/40 focus-visible:ring-warning/20 dark:bg-warning/20 dark:hover:bg-warning/30 dark:focus-visible:ring-warning/40",
        "warning-outline":
          "text-warning border-warning/30 bg-background shadow-xs hover:border-warning/50 dark:bg-warning/5 hover:bg-warning/5 dark:hover:border-warning/60 dark:hover:bg-warning/15 aria-expanded:border-warning aria-expanded:bg-warning/5 dark:aria-expanded:bg-warning/15 focus-visible:border-warning/40 focus-visible:bg-warning/5 dark:focus-visible:bg-warning/15 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        "warning-ghost":
          "text-warning hover:bg-warning/5 dark:hover:bg-warning/15 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 focus-visible:border-warning/40",

        info: "bg-info text-white hover:bg-info/80 focus-visible:border-info/40 focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        "info-soft":
          "bg-info/10 text-info hover:bg-info/20 focus-visible:border-info/40 focus-visible:ring-info/20 dark:bg-info/20 dark:hover:bg-info/30 dark:focus-visible:ring-info/40",
        "info-outline":
          "text-info border-info/30 bg-background shadow-xs hover:border-info/50 dark:bg-info/5 hover:bg-info/5 dark:hover:border-info/60 dark:hover:bg-info/15 aria-expanded:border-info aria-expanded:bg-info/5 dark:aria-expanded:bg-info/15 focus-visible:border-info/40 focus-visible:bg-info/5 dark:focus-visible:bg-info/15 focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        "info-ghost":
          "text-info hover:bg-info/5 dark:hover:bg-info/15 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 focus-visible:border-info/40",

        destructive:
          "bg-destructive text-white hover:bg-destructive/80 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        "destructive-soft":
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        "destructive-outline":
          "text-destructive border-destructive/30 bg-background shadow-xs hover:border-destructive/50 dark:bg-destructive/5 hover:bg-destructive/5 dark:hover:border-destructive/60 dark:hover:bg-destructive/15 aria-expanded:border-destructive aria-expanded:bg-destructive/5 dark:aria-expanded:bg-destructive/15 focus-visible:border-destructive/40 focus-visible:bg-destructive/5 dark:focus-visible:bg-destructive/15 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        "destructive-ghost":
          "text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/15 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 focus-visible:border-destructive/40",
      },
      defaultVariants: { size: "default", variant: "default" },
    },
  },
);

export type ButtonProps = useRender.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export type ButtonIconSize =
  | "icon-xl"
  | "icon-lg"
  | "icon"
  | "icon-sm"
  | "icon-xs";

// ? based on: coss/ui (without loading)
export function Button({
  type = "button",
  size = "default",
  variant = "default",
  className,
  render,
  ...props
}: ButtonProps) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      { type, className: cn(buttonVariants({ className, size, variant })) },
      props,
    ),
    render,
    state: { slot: "button" },
  });
}

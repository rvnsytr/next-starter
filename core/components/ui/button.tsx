"use client";

import { cn } from "@/core/utils/helpers";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 **:[svg]:pointer-events-none **:[svg]:shrink-0 **:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        link: "relative text-primary no-underline after:bg-primary after:absolute after:bottom-1 after:h-[1px] after:w-2/4 after:origin-bottom-right after:scale-x-0 after:transition-transform after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",

        success:
          "bg-success/10 text-success hover:bg-success/20 focus-visible:border-success/40 focus-visible:ring-success/20 dark:bg-success/20 dark:hover:bg-success/30 dark:focus-visible:ring-success/40",
        "outline-success":
          "text-success border-success/30 bg-background shadow-xs hover:border-success/50 dark:bg-success/5 hover:bg-success/5 dark:hover:border-success/60 dark:hover:bg-success/15 aria-expanded:border-success aria-expanded:bg-success/5 dark:aria-expanded:bg-success/15 focus-visible:border-success/40 focus-visible:bg-success/5 dark:focus-visible:bg-success/15 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        "ghost-success":
          "text-success hover:bg-success/5 dark:hover:bg-success/15 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 focus-visible:border-success/40",

        warning:
          "bg-warning/10 text-warning hover:bg-warning/20 focus-visible:border-warning/40 focus-visible:ring-warning/20 dark:bg-warning/20 dark:hover:bg-warning/30 dark:focus-visible:ring-warning/40",
        "outline-warning":
          "text-warning border-warning/30 bg-background shadow-xs hover:border-warning/50 dark:bg-warning/5 hover:bg-warning/5 dark:hover:border-warning/60 dark:hover:bg-warning/15 aria-expanded:border-warning aria-expanded:bg-warning/5 dark:aria-expanded:bg-warning/15 focus-visible:border-warning/40 focus-visible:bg-warning/5 dark:focus-visible:bg-warning/15 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        "ghost-warning":
          "text-warning hover:bg-warning/5 dark:hover:bg-warning/15 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 focus-visible:border-warning/40",

        info: "bg-info/10 text-info hover:bg-info/20 focus-visible:border-info/40 focus-visible:ring-info/20 dark:bg-info/20 dark:hover:bg-info/30 dark:focus-visible:ring-info/40",
        "outline-info":
          "text-info border-info/30 bg-background shadow-xs hover:border-info/50 dark:bg-info/5 hover:bg-info/5 dark:hover:border-info/60 dark:hover:bg-info/15 aria-expanded:border-info aria-expanded:bg-info/5 dark:aria-expanded:bg-info/15 focus-visible:border-info/40 focus-visible:bg-info/5 dark:focus-visible:bg-info/15 focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        "ghost-info":
          "text-info hover:bg-info/5 dark:hover:bg-info/15 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 focus-visible:border-info/40",

        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        "outline-destructive":
          "text-destructive border-destructive/30 bg-background shadow-xs hover:border-destructive/50 dark:bg-destructive/5 hover:bg-destructive/5 dark:hover:border-destructive/60 dark:hover:bg-destructive/15 aria-expanded:border-destructive aria-expanded:bg-destructive/5 dark:aria-expanded:bg-destructive/15 focus-visible:border-destructive/40 focus-visible:bg-destructive/5 dark:focus-visible:bg-destructive/15 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        "ghost-destructive":
          "text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/15 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 focus-visible:border-destructive/40",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 **:[svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 **:[svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg **:[svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };

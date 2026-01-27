import { cn } from "@/core/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

export const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-md border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 **:[svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        link: "relative text-primary no-underline after:bg-primary after:absolute after:bottom-1 after:h-[1px] after:w-2/4 after:origin-bottom-right after:scale-x-0 after:transition-transform after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",

        success:
          "bg-success/10 hover:bg-success/20 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/20 text-success focus-visible:border-success/40 dark:hover:bg-success/30",
        outline_success:
          "text-success border-success/30 bg-background hover:border-success dark:bg-success/5 dark:hover:bg-success/20 focus-visible:border-success focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        ghost_success:
          "hover:bg-success/20 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 text-success focus-visible:border-success/40 hover:bg-success/5 dark:hover:bg-success/20",

        warning:
          "bg-warning/10 hover:bg-warning/20 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 dark:bg-warning/20 text-warning focus-visible:border-warning/40 dark:hover:bg-warning/30",
        outline_warning:
          "text-warning border-warning/30 bg-background hover:border-warning dark:bg-warning/5 dark:hover:bg-warning/20 focus-visible:border-warning focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        ghost_warning:
          "hover:bg-warning/20 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 text-warning focus-visible:border-warning/40 hover:bg-warning/5 dark:hover:bg-warning/20",

        destructive:
          "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
        outline_destructive:
          "text-destructive border-destructive/30 bg-background hover:border-destructive dark:bg-destructive/5 hover:bg-destructive/5 dark:hover:bg-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        ghost_destructive:
          "hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive focus-visible:border-destructive/40 hover:bg-destructive/5 dark:hover:bg-destructive/20",
      },
      size: {
        default: "h-9 px-2.5 in-data-[slot=button-group]:rounded-md",
        xs: "h-6 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md",
        lg: "h-10 px-3",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

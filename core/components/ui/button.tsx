import { cn } from "@/core/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "relative text-primary no-underline after:bg-primary after:absolute after:bottom-1 after:h-[1px] after:w-2/4 after:origin-bottom-right after:scale-x-0 after:transition-transform after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",

        outline_primary:
          "text-primary border border-primary/30 bg-background hover:border-primary dark:bg-primary/5 dark:hover:bg-primary/20 focus-visible:border-primary focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40",
        outline_rvns:
          "text-rvns border border-rvns/30 bg-background hover:border-rvns dark:bg-rvns/5 dark:hover:bg-rvns/20 focus-visible:border-rvns focus-visible:ring-rvns/20 dark:focus-visible:ring-rvns/40",

        success:
          "bg-success text-white hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/60",
        outline_success:
          "text-success border border-success/30 bg-background hover:border-success dark:bg-success/5 dark:hover:bg-success/20 focus-visible:border-success focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        ghost_success:
          "text-success hover:bg-success/10 dark:hover:bg-success/20 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",

        warning:
          "bg-warning text-white hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 dark:bg-warning/60",
        outline_warning:
          "text-warning border border-warning/30 bg-background hover:border-warning dark:bg-warning/5 dark:hover:bg-warning/20 focus-visible:border-warning focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        ghost_warning:
          "text-warning hover:bg-warning/10 dark:hover:bg-warning/20 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",

        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline_destructive:
          "text-destructive border border-destructive/30 bg-background hover:border-destructive dark:bg-destructive/5 dark:hover:bg-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        ghost_destructive:
          "text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
      },
      size: {
        xs: "h-6 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3.5",

        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        icon: "size-9",

        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        "icon-sm": "size-8 rounded-md",

        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        "icon-lg": "size-10 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export type ButtonPropsWithoutChildren = Omit<ButtonProps, "children">;

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

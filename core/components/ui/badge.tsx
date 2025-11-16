import { cn } from "@/core/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

        outline_primary:
          "text-primary border-primary [a&]:border-primary/30 [a&]:hover:border-primary [a&]:dark:bg-primary/5 [a&]:dark:hover:bg-primary/20",
        outline_rvns:
          "text-rvns border-rvns [a&]:border-rvns/30 [a&]:hover:border-rvns [a&]:dark:bg-rvns/5 [a&]:dark:hover:bg-rvns/20",

        success:
          "border-transparent bg-success text-white [a&]:hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/60",
        outline_success:
          "text-success border-success [a&]:border-success/30 [a&]:hover:border-success [a&]:dark:bg-success/5 [a&]:dark:hover:bg-success/20",

        warning:
          "border-transparent bg-warning text-white [a&]:hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 dark:bg-warning/60",
        outline_warning:
          "text-warning border-warning [a&]:border-warning/30 [a&]:hover:border-warning [a&]:dark:bg-warning/5 [a&]:dark:hover:bg-warning/20",

        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline_destructive:
          "text-destructive border-destructive [a&]:border-destructive/30 [a&]:hover:border-destructive [a&]:dark:bg-destructive/5 [a&]:dark:hover:bg-destructive/20",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

export function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

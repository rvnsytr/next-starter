import { cn } from "@/core/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent font-medium text-sm outline-none transition-shadow active:not-aria-[haspopup]:translate-y-px before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 **:[svg:not([class*='opacity-'])]:opacity-80 **:[svg:not([class*='size-'])]:size-4 **:[svg]:pointer-events-none **:[svg]:-mx-0.5 **:[svg]:shrink-0",
  {
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
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 data-pressed:bg-secondary/90 *:data-[slot=button-loading-indicator]:text-secondary-foreground [:active,[data-pressed]]:bg-secondary/80",
        outline:
          "border-input bg-popover not-dark:bg-clip-padding text-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] hover:bg-accent/50 data-pressed:bg-accent/50 *:data-[slot=button-loading-indicator]:text-foreground dark:bg-input/32 dark:data-pressed:bg-input/64 dark:hover:bg-input/64 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none",
        ghost:
          "border-transparent text-foreground hover:bg-accent data-pressed:bg-accent *:data-[slot=button-loading-indicator]:text-foreground",
        link: "relative text-primary no-underline after:bg-primary after:absolute after:bottom-px after:h-px after:w-2/4 after:origin-bottom-right after:scale-x-0 after:transition-transform after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",

        success:
          "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-success bg-success text-white shadow-success/24 shadow-xs hover:bg-success/90 data-pressed:bg-success/90 [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none",
        "success-outline":
          "border-input bg-popover not-dark:bg-clip-padding text-success-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] hover:border-success/32 hover:bg-success/4 data-pressed:border-success/32 data-pressed:bg-success/4 dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none",
        "success-ghost":
          "text-success-foreground hover:bg-success/5 dark:hover:bg-success/15 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 focus-visible:border-success/40",

        warning:
          "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-warning bg-warning text-white shadow-warning/24 shadow-xs hover:bg-warning/90 data-pressed:bg-warning/90 [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none",
        "warning-outline":
          "border-input bg-popover not-dark:bg-clip-padding text-warning-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] hover:border-warning/32 hover:bg-warning/4 data-pressed:border-warning/32 data-pressed:bg-warning/4 dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none",
        "warning-ghost":
          "text-warning-foreground hover:bg-warning/5 dark:hover:bg-warning/15 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 focus-visible:border-warning/40",

        info: "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-info bg-info text-white shadow-info/24 shadow-xs hover:bg-info/90 data-pressed:bg-info/90 [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none",
        "info-outline":
          "border-input bg-popover not-dark:bg-clip-padding text-info-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] hover:border-info/32 hover:bg-info/4 data-pressed:border-info/32 data-pressed:bg-info/4 dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none",
        "info-ghost":
          "text-info-foreground hover:bg-info/5 dark:hover:bg-info/15 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 focus-visible:border-info/40",

        destructive:
          "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-destructive bg-destructive text-white shadow-destructive/24 shadow-xs hover:bg-destructive/90 data-pressed:bg-destructive/90 [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none",
        "destructive-outline":
          "border-input bg-popover not-dark:bg-clip-padding text-destructive-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] hover:border-destructive/32 hover:bg-destructive/4 data-pressed:border-destructive/32 data-pressed:bg-destructive/4 dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none",
        "destructive-ghost":
          "text-destructive-foreground hover:bg-destructive/5 dark:hover:bg-destructive/15 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 focus-visible:border-destructive/40",
      },
      defaultVariants: { size: "default", variant: "default" },
    },
  },
);

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>;

export type ButtonIconSize =
  | "icon-xl"
  | "icon-lg"
  | "icon"
  | "icon-sm"
  | "icon-xs";

export function Button({
  size = "default",
  variant = "default",
  className,
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

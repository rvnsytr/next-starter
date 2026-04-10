"use client";

import { cn } from "@/core/utils/helpers";
import { cva, VariantProps } from "class-variance-authority";
import { Input, InputProps } from "./input";
import { Textarea, TextareaProps } from "./textarea";

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text select-none items-center justify-center gap-2 leading-none *:[kbd]:rounded-[calc(var(--radius)-5px)] **:[svg:not([class*='size-'])]:size-4 **:[svg]:-mx-0.5 not-has-[button]:**:[svg:not([class*='opacity-'])]:opacity-80",
  {
    variants: {
      align: {
        "block-end":
          "order-last w-full justify-start px-[calc(--spacing(3)-1px)] pb-[calc(--spacing(2)-1px)] [.border-t]:pt-[calc(--spacing(2)-1px)] [[data-size=sm]+&]:px-[calc(--spacing(2.5)-1px)]",
        "block-start":
          "order-first w-full justify-start px-[calc(--spacing(3)-1px)] pt-[calc(--spacing(2)-1px)] [.border-b]:pb-[calc(--spacing(2)-1px)] [[data-size=sm]+&]:px-[calc(--spacing(2.5)-1px)]",
        "inline-end":
          "order-last pe-[calc(--spacing(3)-1px)] has-[>:last-child[data-slot=badge]]:-me-1.5 has-[>button]:-me-2 has-[>kbd:last-child]:me-[-0.35rem] [[data-size=sm]+&]:pe-[calc(--spacing(2.5)-1px)]",
        "inline-start":
          "order-first ps-[calc(--spacing(3)-1px)] has-[>:last-child[data-slot=badge]]:-ms-1.5 has-[>button]:-ms-2 has-[>kbd:last-child]:ms-[-0.35rem] [[data-size=sm]+&]:ps-[calc(--spacing(2.5)-1px)]",
      },
    },
    defaultVariants: { align: "inline-start" },
  },
);

export function InputGroup({
  disableFocusStyle = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { disableFocusStyle?: boolean }) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        // Base
        "relative inline-flex w-full min-w-0 items-center rounded-lg border text-sm transition-shadow",
        // Colors
        "border-input bg-background text-foreground ring-ring/24 dark:bg-input/32 shadow-xs/5",
        // Autofill
        "has-autofill:bg-foreground/4 dark:has-autofill:bg-foreground/8",
        // Layout
        "has-data-[align=block-end]:h-auto has-data-[align=block-end]:flex-col has-data-[align=block-start]:h-auto has-data-[align=block-start]:flex-col",
        // Disabled
        "has-[input:disabled,textarea:disabled]:opacity-64",
        // Focus
        !disableFocusStyle &&
          "has-[input:focus-visible,textarea:focus-visible]:border-ring has-[input:focus-visible,textarea:focus-visible]:ring-[3px]",
        // Invalid
        "has-[input[aria-invalid],textarea[aria-invalid]]:border-destructive/50 dark:has-[input[aria-invalid],textarea[aria-invalid]]:ring-destructive/40",
        // Focus Invalid
        "has-[input:focus-visible,textarea:focus-visible]:has-[input[aria-invalid],textarea[aria-invalid]]:border-destructive has-[input:focus-visible,textarea:focus-visible]:has-[input[aria-invalid],textarea[aria-invalid]]:ring-destructive/20 dark:has-[input:focus-visible,textarea:focus-visible]:has-[input[aria-invalid],textarea[aria-invalid]]:ring-destructive/40",
        // Textarea
        "**:[textarea]:min-h-20.5 **:[textarea]:resize-none **:[textarea]:py-[calc(--spacing(3)-1px)]",
        // Misc
        "*:[[data-slot=input-control],[data-slot=textarea-control]]:contents *:[[data-slot=input-control],[data-slot=textarea-control]]:before:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      data-align={align}
      data-slot="input-group-addon"
      className={cn(inputGroupAddonVariants({ align }), className)}
      onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest(
          "button, a, input, select, textarea, [role='button'], [role='combobox'], [role='listbox'], [data-slot='select-trigger']",
        );

        if (isInteractive) return;
        e.preventDefault();

        const parent = e.currentTarget.parentElement;
        const input = parent?.querySelector<
          HTMLInputElement | HTMLTextAreaElement
        >("input, textarea");

        if (input && !parent?.querySelector("input:focus, textarea:focus"))
          input.focus();
      }}
      {...props}
    />
  );
}

export function InputGroupText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground line-clamp-1 flex items-center gap-2 leading-none whitespace-nowrap **:[svg]:pointer-events-none **:[svg]:-mx-0.5 **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupInput(props: InputProps) {
  return <Input unstyled {...props} />;
}

export function InputGroupTextarea(props: TextareaProps) {
  return <Textarea unstyled {...props} />;
}

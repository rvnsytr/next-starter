"use client";

import { cn } from "@/core/utils";
import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { ComponentProps } from "react";

type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root>;
type RadioGroupItemProps = ComponentProps<typeof RadioGroupPrimitive.Item> & {
  classNames?: { indicator?: string; circle?: string };
};

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex gap-2", className)}
      {...props}
    />
  );
}

export function RadioGroupItem({
  className,
  classNames,
  ...props
}: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={cn(
          "relative flex items-center justify-center",
          classNames?.indicator,
        )}
      >
        <CircleIcon
          className={cn(
            "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
            classNames?.circle,
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

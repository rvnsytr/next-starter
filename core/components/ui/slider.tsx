"use client";

import { cn } from "@/core/utils";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { useMemo } from "react";

export function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  className,
  children,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = useMemo(() => {
    if (value !== undefined) return Array.isArray(value) ? value : [value];

    if (defaultValue !== undefined)
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];

    return [min];
  }, [value, defaultValue, min]);

  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      max={max}
      min={min}
      thumbAlignment="edge"
      className={cn("data-[orientation=horizontal]:w-full", className)}
      {...props}
    >
      {children}
      <SliderPrimitive.Control
        data-slot="slider-control"
        className="flex touch-none select-none data-disabled:pointer-events-none data-disabled:opacity-64 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:min-w-44 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:flex-col"
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="before:bg-input relative grow select-none before:absolute before:rounded-full data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:before:inset-x-0.5 data-[orientation=horizontal]:before:inset-y-0 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1 data-[orientation=vertical]:before:inset-x-0 data-[orientation=vertical]:before:inset-y-0.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-indicator"
            className="bg-primary rounded-full select-none data-[orientation=horizontal]:ms-0.5 data-[orientation=vertical]:mb-0.5"
          />
          {Array.from({ length: _values.length }, (_, index) => (
            <SliderPrimitive.Thumb
              key={String(index)}
              data-slot="slider-thumb"
              index={index}
              className="border-input has-focus-visible:ring-ring/24 dark:border-background dark:has-focus-visible:ring-ring/48 block size-5 shrink-0 rounded-full border bg-white shadow-xs/5 transition-[box-shadow,scale] outline-none select-none not-dark:bg-clip-padding before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:ring-[3px] data-dragging:scale-120 sm:size-4 [:has(*:focus-visible),[data-dragging]]:shadow-none"
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export function SliderValue({
  className,
  ...props
}: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={cn("flex justify-end text-sm", className)}
      {...props}
    />
  );
}

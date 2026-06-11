"use client";

import { cn } from "@/core/utils";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { createContext, useCallback, useContext, useState } from "react";

type TimelineContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
};

const TimelineContext = createContext<TimelineContextValue | undefined>(
  undefined,
);

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) throw new Error("useTimeline must be used within a Timeline");
  return context;
};

export type TimelineProps = React.ComponentProps<"div"> & {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
};

export function Timeline({
  orientation = "vertical",
  defaultValue = 1,
  value,
  onValueChange,
  className,
  ...props
}: TimelineProps) {
  const [activeStep, setInternalStep] = useState(defaultValue);

  const setActiveStep = useCallback(
    (step: number) => {
      if (value === undefined) setInternalStep(step);
      onValueChange?.(step);
    },
    [value, onValueChange],
  );

  return (
    <TimelineContext.Provider
      value={{ activeStep: value ?? activeStep, setActiveStep }}
    >
      <div
        data-slot="timeline"
        data-orientation={orientation}
        className={cn(
          "group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      />
    </TimelineContext.Provider>
  );
}

export function TimelineContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="timeline-content"
      {...props}
    />
  );
}

export type TimelineDateProps = useRender.ComponentProps<"time">;

export function TimelineDate({
  className,
  render,
  ...props
}: TimelineDateProps) {
  return useRender({
    defaultTagName: "time",
    props: mergeProps<"time">(
      {
        className: cn(
          "mb-1 block font-medium text-muted-foreground text-xs group-data-[orientation=vertical]/timeline:max-sm:h-4",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "timeline-date" },
  });
}

export function TimelineHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn(className)} data-slot="timeline-header" {...props} />
  );
}

export function TimelineIndicator({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-indicator"
      aria-hidden="true"
      className={cn(
        "border-primary/20 group-data-completed/timeline-item:border-primary absolute size-4 rounded-full border-2 group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type TimelineItemProps = React.ComponentProps<"div"> & { step: number };

export function TimelineItem({ step, className, ...props }: TimelineItemProps) {
  const { activeStep } = useTimeline();

  return (
    <div
      data-slot="timeline-item"
      data-completed={step <= activeStep || undefined}
      className={cn(
        "group/timeline-item has-[+[data-completed]]:**:data-[slot=timeline-separator]:bg-primary relative flex flex-1 flex-col gap-0.5 group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8 group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=vertical]/timeline:not-last:pb-12",
        className,
      )}
      {...props}
    />
  );
}

export function TimelineSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-separator"
      aria-hidden="true"
      className={cn(
        "bg-primary/10 absolute self-start group-last/timeline-item:hidden group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.25rem)] group-data-[orientation=horizontal]/timeline:translate-x-4.5 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=vertical]/timeline:translate-y-4.5",
        className,
      )}
      {...props}
    />
  );
}

export function TimelineTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="timeline-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

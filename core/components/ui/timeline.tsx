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

const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) throw new Error("useTimeline must be used within a Timeline");
  return context;
};

type TimelineProps = useRender.ComponentProps<"div"> & {
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
  render,
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
      {useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
          {
            className: cn(
              "group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
              className,
            ),
          },
          props,
        ),
        render,
        state: { slot: "timeline", orientation },
      })}
    </TimelineContext.Provider>
  );
}

export function TimelineContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("text-muted-foreground text-sm", className) },
      props,
    ),
    render,
    state: { slot: "timeline-content" },
  });
}

type TimelineDateProps = useRender.ComponentProps<"time">;

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
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props,
    render,
    state: { slot: "timeline-header" },
  });
}

type TimelineIndicatorProps = useRender.ComponentProps<"div">;

export function TimelineIndicator({
  className,
  render,
  ...props
}: TimelineIndicatorProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "aria-hidden": true,
        className: cn(
          "group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2 absolute size-4 rounded-full border-2 border-primary/20 group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=horizontal]/timeline:left-0 group-data-completed/timeline-item:border-primary",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "timeline-indicator" },
  });
}

type TimelineItemProps = useRender.ComponentProps<"div"> & { step: number };

export function TimelineItem({
  step,
  className,
  render,
  ...props
}: TimelineItemProps) {
  const { activeStep } = useTimeline();

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "group/timeline-item relative flex flex-1 flex-col gap-0.5 group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8 group-data-[orientation=vertical]/timeline:not-last:pb-6 has-[+[data-completed]]:**:data-[slot=timeline-separator]:bg-primary",
          className,
        ),
      },
      props,
    ),
    state: {
      slot: "timeline-item",
      completed: step <= activeStep || undefined,
    },
  });
}

export function TimelineSeparator({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        "aria-hidden": true,
        className: cn(
          "group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2 absolute self-start bg-primary/10 group-last/timeline-item:hidden group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)] group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=horizontal]/timeline:translate-x-4.5 group-data-[orientation=vertical]/timeline:translate-y-4.5",
          className,
        ),
      },
      props,
    ),
    state: { slot: "timeline-separator" },
  });
}

export function TimelineTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"h3">) {
  return useRender({
    defaultTagName: "h3",
    render,
    props: mergeProps<"h3">(
      { className: cn("font-medium text-sm", className) },
      props,
    ),
    state: { slot: "timeline-title" },
  });
}

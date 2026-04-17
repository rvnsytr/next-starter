"use client";

import { cn } from "@/core/utils";
import { mergeProps } from "@base-ui/react/merge-props";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useRender } from "@base-ui/react/use-render";
import { cva, VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
} from "lucide-react";

const Select: typeof SelectPrimitive.Root = SelectPrimitive.Root;

const selectTriggerVariants = cva(
  "relative inline-flex min-h-8 w-full min-w-36 select-none items-center justify-between gap-2 rounded-lg border border-input bg-background not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-left text-sm text-foreground shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 data-disabled:pointer-events-none data-disabled:opacity-64 dark:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] **:[svg:not([class*='opacity-'])]:opacity-80 **:[svg:not([class*='size-'])]:size-4 **:[svg]:pointer-events-none **:[svg]:shrink-0 [[data-disabled],:focus-visible,[aria-invalid],[data-pressed]]:shadow-none",
  {
    variants: {
      size: {
        default: "",
        lg: "min-h-9",
        sm: "min-h-7 gap-1.5 px-[calc(--spacing(2.5)-1px)]",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type SelectButtonProps = useRender.ComponentProps<"button"> & {
  size?: VariantProps<typeof selectTriggerVariants>["size"];
};

function SelectButton({
  size,
  className,
  render,
  children,
  ...props
}: SelectButtonProps) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        className: cn(selectTriggerVariants({ size }), "min-w-0", className),
        children: (
          <>
            <span className="in-data-placeholder:text-muted-foreground/72 flex-1 truncate">
              {children}
            </span>
            <ChevronsUpDownIcon className="-me-1 size-4 opacity-80" />
          </>
        ),
      },
      props,
    ),
    render,
    state: { slot: "select-button" },
  });
}

function SelectTrigger({
  size = "default",
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props & VariantProps<typeof selectTriggerVariants>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon data-slot="select-icon">
        <ChevronsUpDownIcon className="-me-1 size-4 opacity-80" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn(
        "data-placeholder:text-muted-foreground flex-1 truncate",
        className,
      )}
      {...props}
    />
  );
}

function SelectPopup({
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = true,
  anchor,
  className,
  children,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    | "side"
    | "sideOffset"
    | "align"
    | "alignOffset"
    | "alignItemWithTrigger"
    | "anchor"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        data-slot="select-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        anchor={anchor}
        className="z-50 select-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-popup"
          className="text-foreground origin-(--transform-origin) outline-none"
          {...props}
        >
          <SelectPrimitive.ScrollUpArrow
            data-slot="select-scroll-up-arrow"
            className="before:from-popover top-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:top-px before:h-[200%] before:rounded-t-[calc(var(--radius-lg)-1px)] before:bg-linear-to-b before:from-50%"
          >
            <ChevronUpIcon className="relative size-4" />
          </SelectPrimitive.ScrollUpArrow>
          <div className="bg-popover relative h-full min-w-(--anchor-width) rounded-lg border shadow-lg/5 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]">
            <SelectPrimitive.List
              data-slot="select-list"
              className={cn(
                "max-h-(--available-height) overflow-y-auto p-1",
                className,
              )}
            >
              {children}
            </SelectPrimitive.List>
          </div>
          <SelectPrimitive.ScrollDownArrow
            data-slot="select-scroll-down-arrow"
            className="before:from-popover bottom-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:bottom-px before:h-[200%] before:rounded-b-[calc(var(--radius-lg)-1px)] before:bg-linear-to-t before:from-50%"
          >
            <ChevronDownIcon className="relative size-4" />
          </SelectPrimitive.ScrollDownArrow>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground grid min-h-7 cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-sm outline-none in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] data-disabled:pointer-events-none data-disabled:opacity-64 **:[svg]:pointer-events-none **:[svg]:shrink-0 **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="col-start-1">
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="col-start-2 min-w-0">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border mx-2 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectGroup(props: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectLabel({ className, ...props }: SelectPrimitive.Label.Props) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "text-foreground inline-flex cursor-default items-center gap-2 text-sm/4 font-medium not-in-data-[slot=field]:mb-2",
        className,
      )}
      {...props}
    />
  );
}

function SelectGroupLabel(props: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-group-label"
      className="text-muted-foreground px-2 py-1.5 text-xs font-medium"
      {...props}
    />
  );
}

export {
  Select,
  SelectButton,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  selectTriggerVariants,
  SelectValue,
  type SelectButtonProps,
};

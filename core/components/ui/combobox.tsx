"use client";

import { cn } from "@/core/utils/helpers";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { createContext, useContext, useRef } from "react";
import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { ScrollArea } from "./scroll-area";

export const ComboboxContext: React.Context<{
  chipsRef: React.RefObject<Element | null> | null;
  multiple: boolean;
}> = createContext<{
  chipsRef: React.RefObject<Element | null> | null;
  multiple: boolean;
}>({ chipsRef: null, multiple: false });

export function Combobox<Value, Multiple extends boolean | undefined = false>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple>,
) {
  const chipsRef = useRef<Element | null>(null);
  return (
    <ComboboxContext.Provider value={{ chipsRef, multiple: !!props.multiple }}>
      <ComboboxPrimitive.Root {...props} />
    </ComboboxContext.Provider>
  );
}

export function ComboboxChipsInput({
  size = "default",
  className,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  ref?: React.Ref<HTMLInputElement>;
  size?: "sm" | "default" | "lg" | number;
}) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chips-input"
      data-size={typeof size === "string" ? size : undefined}
      size={typeof size === "number" ? size : undefined}
      className={cn(
        "min-w-12 flex-1 text-sm outline-none [[data-slot=combobox-chip]+&]:ps-0.5",
        size === "sm" ? "ps-1.5" : "ps-2",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxInput({
  size = "default",
  showTrigger = true,
  showClear = false,
  startAddon,
  inputGroupProps,
  triggerProps,
  clearProps,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  ref?: React.Ref<HTMLInputElement>;
  size?: "sm" | "default" | "lg" | number;
  showTrigger?: boolean;
  showClear?: boolean;
  startAddon?: React.ReactNode;
  inputGroupProps?: React.ComponentProps<typeof InputGroup>;
  triggerProps?: React.ComponentProps<typeof InputGroupAddon>;
  clearProps?: React.ComponentProps<typeof InputGroupAddon>;
}) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      render={<InputGroup {...inputGroupProps} />}
    >
      <ComboboxPrimitive.Input
        data-slot="combobox-input"
        render={
          <InputGroupInput
            size={size}
            className="has-disabled:opacity-100"
            nativeInput
          />
        }
        {...props}
      />

      {startAddon && (
        <InputGroupAddon data-slot="combobox-start-addon" aria-hidden="true">
          {startAddon}
        </InputGroupAddon>
      )}

      {showTrigger && (
        <ComboboxPrimitive.Trigger
          data-slot="combobox-trigger"
          nativeButton={false}
          render={
            <InputGroupAddon
              align="inline-end"
              className={cn(
                "has-[+[data-slot=combobox-clear]]:hidden",
                triggerProps?.className,
              )}
              {...triggerProps}
            >
              <Button size="icon-xs" variant="ghost">
                <ComboboxPrimitive.Icon data-slot="combobox-icon">
                  <ChevronsUpDownIcon />
                </ComboboxPrimitive.Icon>
              </Button>
            </InputGroupAddon>
          }
        />
      )}

      {showClear && (
        <ComboboxPrimitive.Clear
          data-slot="combobox-clear"
          nativeButton={false}
          render={
            <InputGroupAddon
              align="inline-end"
              className={cn(
                "has-[+[data-slot=combobox-clear]]:hidden",
                clearProps?.className,
              )}
              {...clearProps}
            >
              <Button size="icon-xs" variant="ghost">
                <XIcon />
              </Button>
            </InputGroupAddon>
          }
        />
      )}
    </ComboboxPrimitive.InputGroup>
  );
}

export function ComboboxTrigger(props: ComboboxPrimitive.Trigger.Props) {
  return <ComboboxPrimitive.Trigger data-slot="combobox-trigger" {...props} />;
}

export function ComboboxPopup({
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset,
  anchor: anchorProp,
  className,
  children,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "sideOffset" | "align" | "alignOffset" | "anchor"
  >) {
  const { chipsRef } = useContext(ComboboxContext);
  const anchor = anchorProp ?? chipsRef;

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        data-slot="combobox-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 select-none"
      >
        <span
          className={cn(
            "bg-popover relative flex max-h-full max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) rounded-lg border shadow-lg/5 transition-[scale,opacity] not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            className,
          )}
        >
          <ComboboxPrimitive.Popup
            data-slot="combobox-popup"
            className="text-foreground flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col"
            {...props}
          >
            {children}
          </ComboboxPrimitive.Popup>
        </span>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

export function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground grid min-h-7 cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-sm outline-none in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] data-disabled:pointer-events-none data-disabled:opacity-64 **:[svg]:pointer-events-none **:[svg]:shrink-0 **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ComboboxPrimitive.ItemIndicator className="col-start-1">
        <CheckIcon />
      </ComboboxPrimitive.ItemIndicator>
      <div className="col-start-2">{children}</div>
    </ComboboxPrimitive.Item>
  );
}

export function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("bg-border mx-2 my-1 h-px last:hidden", className)}
      {...props}
    />
  );
}

export function ComboboxGroup({
  className,
  ...props
}: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("[[role=group]+&]:mt-1.5", className)}
      {...props}
    />
  );
}

export function ComboboxGroupLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-group-label"
      className={cn(
        "text-muted-foreground px-2 py-1.5 text-xs font-medium",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "text-muted-foreground text-center text-sm not-empty:p-2",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxRow(props: ComboboxPrimitive.Row.Props) {
  return <ComboboxPrimitive.Row {...props} />;
}

export function ComboboxValue(props: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

export function ComboboxList({
  className,
  ...props
}: ComboboxPrimitive.List.Props) {
  return (
    <ScrollArea scrollbarGutter scrollFade>
      <ComboboxPrimitive.List
        data-slot="combobox-list"
        className={cn(
          "not-empty:scroll-py-1 not-empty:px-1 not-empty:py-1 in-data-has-overflow-y:pe-3",
          className,
        )}
        {...props}
      />
    </ScrollArea>
  );
}

export function ComboboxStatus({
  className,
  ...props
}: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={cn(
        "text-muted-foreground px-3 py-2 text-xs font-medium empty:m-0 empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

export function ComboboxChips({
  className,
  children,
  startAddon,
  ...props
}: ComboboxPrimitive.Chips.Props & { startAddon?: React.ReactNode }) {
  const { chipsRef } = useContext(ComboboxContext);

  return (
    <ComboboxPrimitive.Chips
      ref={chipsRef as React.Ref<HTMLDivElement> | null}
      data-slot="combobox-chips"
      className={cn(
        "border-input bg-background ring-ring/24 focus-within:ring-ring/50 focus-within:border-ring has-aria-invalid:border-destructive/50 has-autofill:bg-foreground/4 focus-within:has-aria-invalid:border-destructive focus-within:has-aria-invalid:ring-destructive/20 dark:focus-within:has-aria-invalid:ring-destructive/40 dark:not-has-disabled:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/40 relative inline-flex min-h-8 w-full flex-wrap gap-1 rounded-lg border p-[calc(--spacing(1)-1px)] text-sm shadow-xs/5 transition-shadow outline-none *:min-h-6 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-64 has-data-[size=lg]:min-h-9 has-data-[size=lg]:*:min-h-7 has-data-[size=sm]:min-h-7 has-data-[size=sm]:*:min-h-5 has-[:disabled,:focus-within,[aria-invalid]]:shadow-none dark:not-has-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
      {...props}
    >
      {startAddon && (
        <div
          data-slot="combobox-start-addon"
          className="flex shrink-0 items-center ps-2 opacity-80 has-[+[data-slot=combobox-chip]]:pe-2 has-[~[data-size=sm]]:ps-1.5 has-[~[data-size=sm]]:has-[+[data-slot=combobox-chip]]:pe-1.5 **:[svg]:pointer-events-none **:[svg]:-ms-0.5 **:[svg]:-me-1.5 **:[svg:not([class*='size-'])]:size-4"
          aria-hidden="true"
        >
          {startAddon}
        </div>
      )}
      {children}
    </ComboboxPrimitive.Chips>
  );
}

export function ComboboxChip({
  children,
  removeProps,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  removeProps?: ComboboxPrimitive.ChipRemove.Props;
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className="bg-accent text-accent-foreground flex items-center rounded-[calc(var(--radius-md)-1px)] ps-2 text-xs/(--text-xs--line-height) font-medium outline-none **:[svg:not([class*='size-'])]:size-3.5"
      {...props}
    >
      {children}
      <ComboboxChipRemove {...removeProps} />
    </ComboboxPrimitive.Chip>
  );
}

export function ComboboxChipRemove(props: ComboboxPrimitive.ChipRemove.Props) {
  return (
    <ComboboxPrimitive.ChipRemove
      data-slot="combobox-chip-remove"
      className="**[svg:not([class*='size-'])]:size-3.5 h-full shrink-0 cursor-pointer px-1.5 opacity-80 hover:opacity-100"
      aria-label="Remove"
      {...props}
    >
      <XIcon />
    </ComboboxPrimitive.ChipRemove>
  );
}

export const useComboboxFilter: typeof ComboboxPrimitive.useFilter =
  ComboboxPrimitive.useFilter;

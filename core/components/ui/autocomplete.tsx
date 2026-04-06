"use client";

import { cn } from "@/core/utils/helpers";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { ChevronsUpDownIcon, XIcon } from "lucide-react";
import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { ScrollArea } from "./scroll-area";

export const Autocomplete: typeof AutocompletePrimitive.Root =
  AutocompletePrimitive.Root;

export function AutocompleteInput({
  size = "default",
  showTrigger = false,
  showClear = false,
  startAddon,
  inputGroupProps,
  triggerProps,
  clearProps,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> & {
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
    <AutocompletePrimitive.InputGroup
      data-slot="autocomplete-input-group"
      render={<InputGroup {...inputGroupProps} />}
    >
      <AutocompletePrimitive.Input
        data-slot="autocomplete-input"
        render={<InputGroupInput size={size} nativeInput />}
        {...props}
      />

      {startAddon && (
        <InputGroupAddon
          data-slot="autocomplete-start-addon"
          aria-hidden="true"
        >
          {startAddon}
        </InputGroupAddon>
      )}

      {showTrigger && (
        <AutocompletePrimitive.Trigger
          data-slot="autocomplete-trigger"
          nativeButton={false}
          render={
            <InputGroupAddon
              align="inline-end"
              className={cn(
                "has-[+[data-slot=autocomplete-clear]]:hidden",
                triggerProps?.className,
              )}
              {...triggerProps}
            >
              <Button size="icon-xs" variant="ghost">
                <AutocompletePrimitive.Icon data-slot="autocomplete-icon">
                  <ChevronsUpDownIcon />
                </AutocompletePrimitive.Icon>
              </Button>
            </InputGroupAddon>
          }
        />
      )}

      {showClear && (
        <AutocompletePrimitive.Clear
          data-slot="autocomplete-clear"
          nativeButton={false}
          render={
            <InputGroupAddon
              align="inline-end"
              className={cn(
                "has-[+[data-slot=autocomplete-clear]]:hidden",
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
    </AutocompletePrimitive.InputGroup>
  );
}

export function AutocompletePopup({
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  align = "start",
  anchor,
  className,
  children,
  ...props
}: AutocompletePrimitive.Popup.Props &
  Pick<
    AutocompletePrimitive.Positioner.Props,
    "side" | "sideOffset" | "align" | "alignOffset" | "anchor"
  >) {
  return (
    <AutocompletePrimitive.Portal>
      <AutocompletePrimitive.Positioner
        data-slot="autocomplete-positioner"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
        className="z-50 select-none"
      >
        <span
          className={cn(
            "bg-popover relative flex max-h-full max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) rounded-lg border shadow-lg/5 transition-[scale,opacity] not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            className,
          )}
        >
          <AutocompletePrimitive.Popup
            data-slot="autocomplete-popup"
            className="text-foreground flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col"
            {...props}
          >
            {children}
          </AutocompletePrimitive.Popup>
        </span>
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

export function AutocompleteItem({
  className,
  children,
  ...props
}: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground flex min-h-7 cursor-default items-center rounded-sm px-2 py-1 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-64",
        className,
      )}
      {...props}
    >
      {children}
    </AutocompletePrimitive.Item>
  );
}

export function AutocompleteSeparator({
  className,
  ...props
}: AutocompletePrimitive.Separator.Props) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn("bg-border mx-2 my-1 h-px last:hidden", className)}
      {...props}
    />
  );
}

export function AutocompleteGroup({
  className,
  ...props
}: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      data-slot="autocomplete-group"
      className={cn("[[role=group]+&]:mt-1.5", className)}
      {...props}
    />
  );
}

export function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn(
        "text-muted-foreground px-2 py-1.5 text-xs font-medium",
        className,
      )}
      {...props}
    />
  );
}

export function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "text-muted-foreground text-center text-sm not-empty:p-2",
        className,
      )}
      {...props}
    />
  );
}

export function AutocompleteRow({
  className,
  ...props
}: AutocompletePrimitive.Row.Props) {
  return (
    <AutocompletePrimitive.Row
      data-slot="autocomplete-row"
      className={className}
      {...props}
    />
  );
}

export function AutocompleteValue({
  ...props
}: AutocompletePrimitive.Value.Props) {
  return (
    <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />
  );
}

export function AutocompleteList({
  className,
  ...props
}: AutocompletePrimitive.List.Props) {
  return (
    <ScrollArea scrollbarGutter scrollFade>
      <AutocompletePrimitive.List
        className={cn(
          "not-empty:scroll-py-1 not-empty:p-1 in-data-has-overflow-y:pe-3",
          className,
        )}
        data-slot="autocomplete-list"
        {...props}
      />
    </ScrollArea>
  );
}

export function AutocompleteStatus({
  className,
  ...props
}: AutocompletePrimitive.Status.Props) {
  return (
    <AutocompletePrimitive.Status
      data-slot="autocomplete-status"
      className={cn(
        "text-muted-foreground px-3 py-2 text-xs font-medium empty:m-0 empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

export function AutocompleteCollection({
  ...props
}: AutocompletePrimitive.Collection.Props) {
  return (
    <AutocompletePrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  );
}

export const useAutocompleteFilter: typeof AutocompletePrimitive.useFilter =
  AutocompletePrimitive.useFilter;

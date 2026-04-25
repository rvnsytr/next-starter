"use client";

import { cn } from "@/core/utils";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

export const MenuCreateHandle: typeof MenuPrimitive.createHandle =
  MenuPrimitive.createHandle;

export function Menu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menu" {...props} />;
}

export function MenuPortal(props: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="menu-portal" {...props} />;
}

export function MenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

export function MenuPopup({
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset,
  anchor,
  className,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "side" | "sideOffset" | "align" | "alignOffset" | "anchor"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50"
        data-slot="menu-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="menu-popup"
          className={cn(
            "bg-popover relative flex origin-(--transform-origin) rounded-lg border shadow-lg/5 outline-none not-dark:bg-clip-padding not-[class*='w-']:min-w-32 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] focus:outline-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            className,
          )}
          {...props}
        >
          <div className="max-h-(--available-height) w-full overflow-y-auto p-1">
            {children}
          </div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function MenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

export function MenuItem({
  inset,
  variant = "default",
  className,
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "text-foreground data-highlighted:bg-accent data-[variant=destructive]:text-destructive-foreground data-highlighted:text-accent-foreground flex min-h-7 cursor-default items-center gap-2 rounded-md px-2 py-1 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-64 data-inset:ps-8 *:[svg]:pointer-events-none *:[svg]:-mx-0.5 *:[svg]:shrink-0 *:[svg:not([class*='opacity-'])]:opacity-80 *:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function MenuCheckboxItem({
  checked,
  variant = "default",
  checkIcon: Icon = <CheckIcon />,
  className,
  children,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  variant?: "default" | "switch";
  checkIcon?: React.ReactNode;
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      checked={checked}
      className={cn(
        "text-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground grid min-h-7 cursor-default items-center gap-2 rounded-md py-1 ps-2 text-sm outline-none select-none in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] data-disabled:pointer-events-none data-disabled:opacity-64 **:[svg]:pointer-events-none **:[svg]:shrink-0 **:[svg:not([class*='size-'])]:size-4",
        variant === "switch"
          ? "grid-cols-[1fr_auto] gap-4 pe-1.5"
          : "grid-cols-[.75rem_1fr] pe-4",
        className,
      )}
      {...props}
    >
      {variant === "switch" ? (
        <>
          <span className="col-start-1">{children}</span>
          <MenuPrimitive.CheckboxItemIndicator
            className="focus-visible:ring-ring focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-input inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 items-center rounded-full p-px inset-shadow-[0_1px_--theme(--color-black/4%)] transition-[background-color,box-shadow] duration-200 outline-none [--thumb-size:--spacing(4)] focus-visible:ring-2 focus-visible:ring-offset-1 data-disabled:opacity-64 sm:[--thumb-size:--spacing(3)]"
            keepMounted
          >
            <span className="bg-background pointer-events-none block aspect-square h-full origin-left rounded-(--thumb-size) shadow-sm/5 will-change-transform [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s] in-[[data-slot=menu-checkbox-item]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.10)] in-[[data-slot=menu-checkbox-item]:active]:not-data-disabled:scale-x-110 in-[[data-slot=menu-checkbox-item][data-checked]]:origin-[var(--thumb-size)_50%] in-[[data-slot=menu-checkbox-item][data-checked]]:translate-x-[calc(var(--thumb-size)-4px)]" />
          </MenuPrimitive.CheckboxItemIndicator>
        </>
      ) : (
        <>
          <MenuPrimitive.CheckboxItemIndicator className="col-start-1 -ms-0.5">
            {Icon}
          </MenuPrimitive.CheckboxItemIndicator>
          <span className="col-start-2">{children}</span>
        </>
      )}
    </MenuPrimitive.CheckboxItem>
  );
}

export function MenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

export function MenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(
        "text-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground grid min-h-7 cursor-default grid-cols-[.75rem_1fr] items-center gap-2 rounded-md py-1 ps-2 pe-4 text-sm outline-none in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] data-disabled:pointer-events-none data-disabled:opacity-64 **:[svg]:pointer-events-none **:[svg]:shrink-0 **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MenuPrimitive.RadioItemIndicator className="col-start-1 -ms-0.5">
        <CheckIcon />
      </MenuPrimitive.RadioItemIndicator>
      <span className="col-start-2">{children}</span>
    </MenuPrimitive.RadioItem>
  );
}

export function MenuGroupLabel({
  inset,
  className,
  ...props
}: MenuPrimitive.GroupLabel.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-label"
      data-inset={inset}
      className={cn(
        "text-muted-foreground px-2 py-1.5 text-xs font-medium data-inset:ps-9 sm:data-inset:ps-8",
        className,
      )}
      {...props}
    />
  );
}

export function MenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("bg-border my-1 h-px", className)}
      {...props}
    />
  );
}

export function MenuShortcut({
  className,
  ...props
}: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="menu-shortcut"
      className={cn(
        "text-muted-foreground/72 ms-auto font-sans text-xs font-medium tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export function MenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />;
}

export function MenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "text-foreground data-highlighted:bg-accent data-popup-open:bg-accent data-highlighted:text-accent-foreground data-popup-open:text-accent-foreground flex min-h-7 items-center gap-2 rounded-md px-2 py-1 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-64 data-inset:ps-8 **:[svg]:pointer-events-none *:[svg:not(:last-child)]:-mx-0.5 **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto -me-0.5 opacity-80" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

export function MenuSubPopup({
  sideOffset = 0,
  align = "start",
  alignOffset,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "sideOffset" | "align" | "alignOffset"
  >) {
  const defaultAlignOffset = align !== "center" ? -5 : undefined;

  return (
    <MenuPopup
      data-slot="menu-sub-content"
      side="inline-end"
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset ?? defaultAlignOffset}
      {...props}
    />
  );
}

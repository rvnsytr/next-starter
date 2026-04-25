"use client";

import { cn } from "@/core/utils";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

const PopoverCreateHandle: typeof PopoverPrimitive.createHandle =
  PopoverPrimitive.createHandle;

const Popover: typeof PopoverPrimitive.Root = PopoverPrimitive.Root;

function PopoverTrigger({
  children,
  ...props
}: PopoverPrimitive.Trigger.Props) {
  return (
    <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props}>
      {children}
    </PopoverPrimitive.Trigger>
  );
}

function PopoverPopup({
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  tooltipStyle = false,
  anchor,
  className,
  children,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "side" | "sideOffset" | "align" | "alignOffset" | "anchor"
  > & { tooltipStyle?: boolean }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        data-slot="popover-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] data-instant:transition-none"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-popup"
          className={cn(
            "bg-popover text-popover-foreground relative flex h-(--popup-height,auto) w-(--popup-width,auto) origin-(--transform-origin) rounded-lg border shadow-lg/5 transition-[width,height,scale,opacity] outline-none not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] has-data-[slot=calendar]:rounded-xl has-data-[slot=calendar]:before:rounded-[calc(var(--radius-xl)-1px)] data-starting-style:scale-98 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            tooltipStyle &&
              "w-fit rounded-lg text-xs text-balance shadow-md/5 before:rounded-[calc(var(--radius-lg)-1px)]",
            className,
          )}
          {...props}
        >
          <PopoverPrimitive.Viewport
            data-slot="popover-viewport"
            className={cn(
              "relative size-full max-h-(--available-height) overflow-clip px-(--viewport-inline-padding) py-4 [--viewport-inline-padding:--spacing(4)] has-data-[slot=calendar]:p-2 **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-current:opacity-100 **:data-current:transition-opacity **:data-current:data-ending-style:opacity-0 data-instant:transition-none **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:opacity-100 **:data-previous:transition-opacity **:data-previous:data-ending-style:opacity-0 **:data-current:data-starting-style:opacity-0 **:data-previous:data-starting-style:opacity-0",
              tooltipStyle
                ? "py-1 [--viewport-inline-padding:--spacing(2)]"
                : "not-data-transitioning:overflow-y-auto",
            )}
          >
            {children}
          </PopoverPrimitive.Viewport>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverClose(props: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverClose,
  PopoverCreateHandle,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
};

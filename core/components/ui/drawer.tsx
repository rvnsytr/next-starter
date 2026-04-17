"use client";

import { cn } from "@/core/utils";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { mergeProps } from "@base-ui/react/merge-props";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { useRender } from "@base-ui/react/use-render";
import { ChevronRightIcon, XIcon } from "lucide-react";
import { createContext, useContext } from "react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

type DrawerPosition = "right" | "left" | "top" | "bottom";

const DrawerContext: React.Context<{ position: DrawerPosition }> =
  createContext<{ position: DrawerPosition }>({ position: "bottom" });

const directionMap: Record<
  DrawerPosition,
  DrawerPrimitive.Root.Props["swipeDirection"]
> = { bottom: "down", left: "left", right: "right", top: "up" };

const DrawerCreateHandle: typeof DrawerPrimitive.createHandle =
  DrawerPrimitive.createHandle;

function Drawer({
  position = "bottom",
  swipeDirection,
  ...props
}: DrawerPrimitive.Root.Props & { position?: DrawerPosition }) {
  return (
    <DrawerContext.Provider value={{ position }}>
      <DrawerPrimitive.Root
        swipeDirection={swipeDirection ?? directionMap[position]}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

const DrawerPortal: typeof DrawerPrimitive.Portal = DrawerPrimitive.Portal;

function DrawerTrigger(props: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerClose(props: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerSwipeArea({
  position: positionProp,
  className,
  ...props
}: DrawerPrimitive.SwipeArea.Props & { position?: DrawerPosition }) {
  const { position: contextPosition } = useContext(DrawerContext);
  const position = positionProp ?? contextPosition;

  return (
    <DrawerPrimitive.SwipeArea
      data-slot="drawer-swipe-area"
      className={cn(
        "fixed z-50 touch-none",
        position === "bottom" && "inset-x-0 bottom-0 h-8",
        position === "top" && "inset-x-0 top-0 h-8",
        position === "left" && "inset-y-0 left-0 w-8",
        position === "right" && "inset-y-0 right-0 w-8",
        className,
      )}
      {...props}
    />
  );
}

function DrawerBackdrop({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/32 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-sm transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  );
}

function DrawerViewport({
  className,
  position,
  variant = "default",
  ...props
}: DrawerPrimitive.Viewport.Props & {
  position?: DrawerPosition;
  variant?: "default" | "straight" | "inset";
}) {
  return (
    <DrawerPrimitive.Viewport
      data-slot="drawer-viewport"
      className={cn(
        "fixed inset-0 z-50 [--bleed:--spacing(12)] [--inset:--spacing(0)]",
        "touch-none",
        position === "bottom" && "grid grid-rows-[1fr_auto] pt-12",
        position === "top" && "grid grid-rows-[auto_1fr] pb-12",
        position === "left" && "flex justify-start",
        position === "right" && "flex justify-end",
        variant === "inset" && "px-(--inset) sm:[--inset:--spacing(4)]",
        variant === "inset" && position !== "bottom" && "pt-(--inset)",
        variant === "inset" && position !== "top" && "pb-(--inset)",
        className,
      )}
      {...props}
    />
  );
}

function DrawerPopup({
  className,
  children,
  showCloseButton = false,
  position: positionProp,
  variant = "default",
  showBar = false,
  ...props
}: DrawerPrimitive.Popup.Props & {
  variant?: "default" | "straight" | "inset";
  position?: DrawerPosition;
  showBar?: boolean;
  showCloseButton?: boolean;
}) {
  const { position: contextPosition } = useContext(DrawerContext);
  const position = positionProp ?? contextPosition;

  return (
    <DrawerPortal>
      <DrawerBackdrop />
      <DrawerViewport variant={variant} position={position}>
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          className={cn(
            "bg-popover text-popover-foreground after:bg-popover relative flex max-h-full min-h-0 w-full min-w-0 flex-col shadow-lg/5 transition-[transform,box-shadow,height,background-color] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform outline-none [--peek:calc(--spacing(6)-1px)] [--scale-base:calc(max(0,1-(var(--nested-drawers)*var(--stack-step))))] [--scale:clamp(0,calc(var(--scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--shrink:calc(1-var(--scale))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-step:0.05] not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute data-ending-style:shadow-transparent data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-nested-drawer-open:overflow-hidden data-nested-drawer-open:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(2%*(var(--nested-drawers)-var(--stack-progress))))] data-starting-style:shadow-transparent data-swiping:select-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)] dark:data-nested-drawer-open:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(6%*(var(--nested-drawers)-var(--stack-progress))))]",
            "touch-none",

            position === "bottom" &&
              "row-start-2 -mb-[max(0px,calc(var(--drawer-snap-point-offset,0px)+clamp(0,1,var(--drawer-snap-point-offset,0px)/1px)*var(--drawer-swipe-movement-y,0px)))] transform-[translateY(calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] border-t pb-[max(0px,calc(env(safe-area-inset-bottom,0px)+var(--drawer-snap-point-offset,0px)+clamp(0,1,var(--drawer-snap-point-offset,0px)/1px)*var(--drawer-swipe-movement-y,0px)))] not-data-starting-style:not-data-ending-style:transition-[transform,box-shadow,height,background-color,margin,padding] after:inset-x-0 after:top-full after:h-(--bleed) has-data-[slot=drawer-bar]:pt-2 data-ending-style:mb-0 data-ending-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)+var(--inset)))] data-ending-style:pb-0 data-starting-style:mb-0 data-starting-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)+var(--inset)))] data-starting-style:pb-0",
            position === "top" &&
              "transform-[translateY(var(--drawer-swipe-movement-y))] border-b after:inset-x-0 after:bottom-full after:h-(--bleed) has-data-[slot=drawer-bar]:pb-2 data-ending-style:transform-[translateY(calc(-100%-var(--inset)))] data-starting-style:transform-[translateY(calc(-100%-var(--inset)))]",
            position === "left" &&
              "w-[calc(100%-(--spacing(12)))] max-w-md transform-[translateX(var(--drawer-swipe-movement-x))] border-e after:inset-y-0 after:end-full after:w-(--bleed) has-data-[slot=drawer-bar]:pe-2 data-ending-style:transform-[translateX(calc(-100%-var(--inset)))] data-starting-style:transform-[translateX(calc(-100%-var(--inset)))]",
            position === "right" &&
              "col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md transform-[translateX(var(--drawer-swipe-movement-x))] border-s after:inset-y-0 after:start-full after:w-(--bleed) has-data-[slot=drawer-bar]:ps-2 data-ending-style:transform-[translateX(calc(100%+var(--inset)))] data-starting-style:transform-[translateX(calc(100%+var(--inset)))]",

            variant !== "straight" &&
              cn(
                position === "bottom" && "rounded-t-2xl",
                position === "top" &&
                  "rounded-b-2xl **:data-[slot=drawer-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]",
                position === "left" &&
                  "rounded-e-2xl **:data-[slot=drawer-footer]:rounded-ee-[calc(var(--radius-2xl)-1px)]",
                position === "right" &&
                  "rounded-s-2xl **:data-[slot=drawer-footer]:rounded-es-[calc(var(--radius-2xl)-1px)]",
              ),
            variant === "default" &&
              cn(
                position === "bottom" &&
                  "before:rounded-t-[calc(var(--radius-2xl)-1px)]",
                position === "top" &&
                  "before:rounded-b-[calc(var(--radius-2xl)-1px)]",
                position === "left" &&
                  "before:rounded-e-[calc(var(--radius-2xl)-1px)]",
                position === "right" &&
                  "before:rounded-s-[calc(var(--radius-2xl)-1px)]",
              ),
            variant === "inset" &&
              "before:hidden sm:rounded-2xl sm:border sm:before:rounded-[calc(var(--radius-2xl)-1px)] sm:after:bg-transparent sm:**:data-[slot=drawer-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]",
            variant === "straight" && "[--stack-step:0]",

            (position === "bottom" || position === "top") &&
              "h-(--drawer-height,auto) [--height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height))))] data-nested-drawer-open:h-(--height)",
            position === "bottom" &&
              "origin-[50%_calc(100%-var(--inset))] data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--shrink)*var(--height))))_scale(var(--scale))]",
            position === "top" &&
              "origin-[50%_var(--inset)] data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--shrink)*var(--height))))_scale(var(--scale))]",
            position === "left" &&
              "origin-right data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)))_scale(var(--scale))]",
            position === "right" &&
              "origin-left data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)))_scale(var(--scale))]",

            className,
          )}
          {...props}
        >
          {children}

          {showCloseButton && (
            <DrawerPrimitive.Close
              aria-label="Close"
              className="absolute inset-e-2 top-2"
              render={
                <Button size="icon" variant="ghost">
                  <XIcon />
                </Button>
              }
            />
          )}

          {showBar && <DrawerBar />}
        </DrawerPrimitive.Popup>
      </DrawerViewport>
    </DrawerPortal>
  );
}

function DrawerHeader({
  allowSelection = false,
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & { allowSelection?: boolean }) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex flex-col gap-2 p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pb-3 max-sm:pb-4",
          !allowSelection && "cursor-default",
          className,
        ),
      },
      props,
    ),
    render: allowSelection ? <DrawerContent render={render} /> : render,
    state: { slot: "drawer-header" },
  });
}

function DrawerFooter({
  variant = "default",
  allowSelection = true,
  render,
  className,
  ...props
}: useRender.ComponentProps<"div"> & {
  variant?: "default" | "bare";
  allowSelection?: boolean;
}) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex flex-col-reverse gap-2 p-4 pb-(--safe-area-inset-bottom,0px) sm:flex-row sm:justify-end",
          !allowSelection && "cursor-default",
          variant === "default" &&
            "border-t bg-muted/72 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(4))]",
          variant === "bare" &&
            "pt-0 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(6))]",
          className,
        ),
      },
      props,
    ),
    render: allowSelection ? <DrawerContent render={render} /> : render,
    state: { slot: "drawer-footer" },
  });
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "flex items-center justify-center gap-2 text-lg leading-tight font-semibold sm:text-base **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm text-pretty *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

function DrawerPanel({
  scrollFade = true,
  scrollable = true,
  allowSelection = true,
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  scrollFade?: boolean;
  scrollable?: boolean;
  allowSelection?: boolean;
}) {
  const content = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-header])]:pt-1 in-[[data-slot=drawer-popup]:has([data-slot=drawer-footer]:not(.border-t))]:pb-1",
          !allowSelection && "cursor-default",
          className,
        ),
      },
      props,
    ),
    render: allowSelection ? <DrawerContent render={render} /> : render,
    state: { slot: "drawer-panel" },
  });

  if (scrollable) {
    return (
      <ScrollArea className="touch-auto" scrollFade={scrollFade}>
        {content}
      </ScrollArea>
    );
  }

  return content;
}

function DrawerBar({
  position: positionProp,
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & { position?: DrawerPosition }) {
  const { position: contextPosition } = useContext(DrawerContext);
  const position = positionProp ?? contextPosition;
  const horizontal = position === "left" || position === "right";

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "absolute flex touch-none items-center justify-center p-3 before:rounded-full before:bg-input",
          horizontal
            ? "inset-y-0 before:h-12 before:w-1"
            : "inset-x-0 before:h-1 before:w-12",
          position === "top" && "bottom-0",
          position === "bottom" && "top-0",
          position === "left" && "right-0",
          position === "right" && "left-0",
          className,
        ),
        "aria-hidden": true,
      },
      props,
    ),
    render,
    state: { slot: "drawer-bar" },
  });
}

const DrawerContent: typeof DrawerPrimitive.Content = DrawerPrimitive.Content;

function DrawerMenu({
  className,
  render,
  ...props
}: useRender.ComponentProps<"nav">) {
  return useRender({
    defaultTagName: "nav",
    props: mergeProps<"nav">(
      { className: cn("-m-2 flex flex-col", className) },
      props,
    ),
    render,
    state: { slot: "drawer-menu" },
  });
}

function DrawerMenuItem({
  variant = "default",
  className,
  disabled,
  render,
  ...props
}: useRender.ComponentProps<"button"> & {
  variant?: "default" | "destructive";
}) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: "button",
        className: cn(
          "flex min-h-9 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-64 data-[variant=destructive]:text-destructive-foreground sm:min-h-8 sm:text-sm *:[svg:not([class*='opacity-'])]:opacity-80 *:[svg:not([class*='size-'])]:size-4 *:[svg]:pointer-events-none *:[svg]:-mx-0.5 *:[svg]:shrink-0",
          className,
        ),
        disabled,
      },
      props,
    ),
    render,
    state: { slot: "drawer-menu-item", variant },
  });
}

function DrawerMenuSeparator({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("mx-2 my-1 h-px bg-border", className) },
      props,
    ),
    render,
    state: { slot: "drawer-menu-separator" },
  });
}

function DrawerMenuGroup({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("flex flex-col", className) },
      props,
    ),
    render,
    state: { slot: "drawer-menu-group" },
  });
}

function DrawerMenuGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "px-2 py-1.5 font-medium text-muted-foreground text-xs",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "drawer-menu-group-label" },
  });
}

function DrawerMenuTrigger({
  className,
  children,
  ...props
}: DrawerPrimitive.Trigger.Props) {
  return (
    <DrawerTrigger
      data-slot="drawer-menu-trigger"
      className={cn(
        "text-foreground hover:bg-accent hover:text-accent-foreground flex min-h-9 w-full cursor-default items-center gap-2 rounded-sm px-2 py-1 text-base outline-none select-none sm:min-h-8 sm:text-sm **:[svg]:pointer-events-none **:[svg]:shrink-0 **:[svg:not([class*='size-'])]:size-4.5 sm:**:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto -me-0.5 opacity-80" />
    </DrawerTrigger>
  );
}

function DrawerMenuCheckboxItem({
  checked,
  defaultChecked,
  onCheckedChange,
  variant = "default",
  className,
  disabled,
  render,
  children,
  ...props
}: CheckboxPrimitive.Root.Props & {
  variant?: "default" | "switch";
  render?: React.ReactElement;
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="drawer-menu-checkbox-item"
      defaultChecked={defaultChecked}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "text-foreground hover:bg-accent hover:text-accent-foreground grid min-h-9 w-full cursor-default items-center gap-2 rounded-sm px-2 py-1 text-base outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm **:[svg]:pointer-events-none **:[svg]:-mx-0.5 **:[svg]:shrink-0 **:[svg:not([class*='opacity-'])]:opacity-80 **:[svg:not([class*='size-'])]:size-4.5 sm:**:[svg:not([class*='size-'])]:size-4",
        variant === "switch"
          ? "grid-cols-[1fr_auto] gap-4 pe-1.5"
          : "grid-cols-[1rem_1fr] pe-4",
        className,
      )}
      disabled={disabled}
      render={render}
      {...props}
    >
      {variant === "switch" ? (
        <>
          <span className="col-start-1">{children}</span>
          <CheckboxPrimitive.Indicator
            className="focus-visible:ring-ring focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-input col-start-2 inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 items-center rounded-full p-px inset-shadow-[0_1px_--theme(--color-black/4%)] transition-[background-color,box-shadow] duration-200 outline-none [--thumb-size:--spacing(4)] focus-visible:ring-2 focus-visible:ring-offset-1 data-disabled:opacity-64 sm:[--thumb-size:--spacing(3)]"
            keepMounted
          >
            <span className="bg-background pointer-events-none block aspect-square h-full origin-left rounded-(--thumb-size) shadow-sm/5 will-change-transform [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s] in-[[data-slot=drawer-menu-checkbox-item]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.10)] in-[[data-slot=drawer-menu-checkbox-item]:active]:not-data-disabled:scale-x-110 in-[[data-slot=drawer-menu-checkbox-item][data-checked]]:origin-[var(--thumb-size)_50%] in-[[data-slot=drawer-menu-checkbox-item][data-checked]]:translate-x-[calc(var(--thumb-size)-4px)]" />
          </CheckboxPrimitive.Indicator>
        </>
      ) : (
        <>
          <CheckboxPrimitive.Indicator className="col-start-1">
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
            </svg>
          </CheckboxPrimitive.Indicator>
          <span className="col-start-2">{children}</span>
        </>
      )}
    </CheckboxPrimitive.Root>
  );
}

function DrawerMenuRadioGroup({
  className,
  ...props
}: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="drawer-menu-radio-group"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function DrawerMenuRadioItem({
  className,
  children,
  value,
  disabled,
  render,
  ...props
}: RadioPrimitive.Root.Props & { value: string; render?: React.ReactElement }) {
  return (
    <RadioPrimitive.Root
      data-slot="drawer-menu-radio-item"
      value={value}
      className={cn(
        "text-foreground hover:bg-accent hover:text-accent-foreground grid min-h-9 w-full cursor-default items-center gap-2 rounded-sm px-2 py-1 text-base outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm **:[svg]:pointer-events-none **:[svg]:-mx-0.5 **:[svg]:shrink-0 **:[svg:not([class*='opacity-'])]:opacity-80 **:[svg:not([class*='size-'])]:size-4.5 sm:**:[svg:not([class*='size-'])]:size-4",
        "grid-cols-[1rem_1fr] items-center pe-4",
        className,
      )}
      disabled={disabled}
      render={render}
      {...props}
    >
      <RadioPrimitive.Indicator className="col-start-1">
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
        </svg>
      </RadioPrimitive.Indicator>
      <span className="col-start-2">{children}</span>
    </RadioPrimitive.Root>
  );
}

export {
  Drawer,
  DrawerBackdrop,
  DrawerBar,
  DrawerClose,
  DrawerContent,
  DrawerCreateHandle,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuCheckboxItem,
  DrawerMenuGroup,
  DrawerMenuGroupLabel,
  DrawerMenuItem,
  DrawerMenuRadioGroup,
  DrawerMenuRadioItem,
  DrawerMenuSeparator,
  DrawerMenuTrigger,
  DrawerPanel,
  DrawerPopup,
  DrawerPortal,
  DrawerSwipeArea,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
};

"use client";

import { cn } from "@/core/utils";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { XIcon } from "lucide-react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

const DialogCreateHandle: typeof DialogPrimitive.createHandle =
  DialogPrimitive.createHandle;

const Dialog: typeof DialogPrimitive.Root = DialogPrimitive.Root;

const DialogPortal: typeof DialogPrimitive.Portal = DialogPrimitive.Portal;

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogBackdrop({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogViewport({
  className,
  ...props
}: DialogPrimitive.Viewport.Props) {
  return (
    <DialogPrimitive.Viewport
      className={cn(
        "fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4",
        className,
      )}
      data-slot="dialog-viewport"
      {...props}
    />
  );
}

function DialogPopup({
  showCloseButton = true,
  bottomStickOnMobile = true,
  closeProps,
  className,
  children,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  bottomStickOnMobile?: boolean;
  closeProps?: DialogPrimitive.Close.Props;
}) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogViewport
        className={cn(
          bottomStickOnMobile &&
            "max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12",
        )}
      >
        <DialogPrimitive.Popup
          data-slot="dialog-popup"
          className={cn(
            "bg-popover text-popover-foreground relative row-start-2 flex max-h-full min-h-0 w-full max-w-lg min-w-0 origin-center flex-col rounded-2xl border opacity-[calc(1-var(--nested-dialogs))] shadow-lg/5 transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform outline-none not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:opacity-0 data-starting-style:opacity-0 sm:scale-[calc(1-0.1*var(--nested-dialogs))] sm:data-ending-style:scale-98 sm:data-starting-style:scale-98 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            bottomStickOnMobile &&
              "max-sm:max-w-none max-sm:origin-bottom max-sm:rounded-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0 max-sm:before:hidden max-sm:before:rounded-none max-sm:data-ending-style:translate-y-4 max-sm:data-starting-style:translate-y-4",
            className,
          )}
          {...props}
        >
          {children}

          {showCloseButton && (
            <DialogPrimitive.Close
              aria-label="Close"
              className="absolute inset-e-2 top-2"
              render={<Button size="icon" variant="ghost" />}
              {...closeProps}
            >
              <XIcon />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </DialogViewport>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("flex flex-col gap-2 p-4 text-left", className),
      },
      props,
    ),
    render,
    state: { slot: "dialog-header" },
  });
}

function DialogFooter({
  variant = "default",
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & { variant?: "default" | "bare" }) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex flex-col-reverse gap-2 p-4 sm:flex-row sm:justify-end sm:rounded-b-[calc(var(--radius-2xl)-1px)]",
          variant === "default" && "border-t bg-muted/72",
          variant === "bare" && "pt-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "dialog-footer" },
  });
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "flex items-center gap-2 text-lg leading-tight font-semibold sm:text-base **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm text-pretty *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

function DialogPanel({
  className,
  scrollFade = true,
  render,
  ...props
}: useRender.ComponentProps<"div"> & { scrollFade?: boolean }) {
  return (
    <ScrollArea scrollFade={scrollFade}>
      {useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
          {
            className: cn(
              "p-4 in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-1 in-[[data-slot=dialog-popup]:has([data-slot=dialog-footer]:not(.border-t))]:pb-1",
              className,
            ),
          },
          props,
        ),
        render,
        state: { slot: "dialog-panel" },
      })}
    </ScrollArea>
  );
}

export {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogCreateHandle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
};

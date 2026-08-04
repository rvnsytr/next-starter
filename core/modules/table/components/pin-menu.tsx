"use client";

import { Button, ButtonProps } from "@/core/components/ui/button";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { ColumnPinningPosition } from "@tanstack/react-table";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PinIcon,
  PinOffIcon,
  XIcon,
} from "lucide-react";
import { dataTable } from "../hooks/data-table";

export type PinMenuProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export function PinMenu({
  pinPosition,
  unpinButtonProps,
  pinStartButtonProps,
  pinEndButtonProps,
  align = "center",
  size,
  variant = "ghost",
  children,
  ...props
}: PinMenuProps & {
  pinPosition: ColumnPinningPosition;
  unpinButtonProps: Pick<ButtonProps, "onClick" | "disabled">;
  pinStartButtonProps: Pick<ButtonProps, "onClick" | "disabled">;
  pinEndButtonProps: Pick<ButtonProps, "onClick" | "disabled">;
}) {
  const buttonSize: ButtonProps["size"] = size ?? (children ? "xs" : "icon-xs");
  const isIconSize = buttonSize.startsWith("icon");

  const popupAlign =
    pinPosition === "start" ? "start" : pinPosition === "end" ? "end" : align;

  const ColumnPinIcon = !!pinPosition ? PinOffIcon : PinIcon;

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button size={buttonSize} variant={variant} {...props}>
                  {children ?? (isIconSize && <ColumnPinIcon />)}
                </Button>
              }
            />
          }
        />

        <TooltipPopup align={popupAlign}>Pin Column</TooltipPopup>
      </Tooltip>

      <PopoverPopup className="*:p-1" align={popupAlign}>
        <Button size="icon-xs" variant="ghost" {...pinStartButtonProps}>
          <ArrowLeftIcon />
        </Button>
        <Button
          size="icon-xs"
          variant="destructive-ghost"
          {...unpinButtonProps}
        >
          <XIcon />
        </Button>
        <Button size="icon-xs" variant="ghost" {...pinEndButtonProps}>
          <ArrowRightIcon />
        </Button>
      </PopoverPopup>
    </Popover>
  );
}

export function DataTablePinMenu({ onClick, ...props }: PinMenuProps) {
  const header = dataTable.useHeaderContext();

  if (!header.column.getCanPin()) return null;

  const pinnningPosition = header.column.getIsPinned();

  return (
    <PinMenu
      pinPosition={pinnningPosition}
      unpinButtonProps={{
        onClick: () => header.column.pin(false),
        disabled: pinnningPosition === false,
      }}
      pinStartButtonProps={{
        onClick: () => header.column.pin("start"),
        disabled: pinnningPosition === "start",
      }}
      pinEndButtonProps={{
        onClick: () => header.column.pin("end"),
        disabled: pinnningPosition === "end",
      }}
      {...props}
    />
  );
}

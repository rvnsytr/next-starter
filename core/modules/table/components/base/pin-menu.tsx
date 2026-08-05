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
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  PinIcon,
  PinOffIcon,
} from "lucide-react";

export type PinMenuProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export function PinMenu({
  tableType,
  align = "center",
  size,
  variant = "ghost",
  children,
  ...props
}: PinMenuProps & { tableType: DataTableType }) {
  const header = getTableHook(tableType).useHeaderContext();
  if (!header.column.getCanPin()) return null;

  const buttonSize: ButtonProps["size"] = size ?? (children ? "xs" : "icon-xs");
  const isIconSize = buttonSize.startsWith("icon");

  const pinPosition = header.column.getIsPinned();
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
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => header.column.pin("start")}
          disabled={pinPosition === "start"}
        >
          <ArrowLeftToLineIcon />
        </Button>

        <Button
          size="icon-xs"
          variant="destructive-ghost"
          onClick={() => header.column.pin(false)}
          disabled={!pinPosition}
        >
          <PinOffIcon />
        </Button>

        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => header.column.pin("end")}
          disabled={pinPosition === "end"}
        >
          <ArrowRightToLineIcon />
        </Button>
      </PopoverPopup>
    </Popover>
  );
}

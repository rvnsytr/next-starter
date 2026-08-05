"use client";

import { ButtonProps, ResetButton } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";

export type ResetProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "R" */
  shortcut?: "default" | Hotkey;
};

export const TABLE_RESET_DEFAULT_HOTKEY: Hotkey = "R";

export function Reset({
  tableType,
  shortcut,
  align = "center",
  size,
  variant = "outline",
  onClick,
  children,
  ...props
}: ResetProps & { tableType: DataTableType }) {
  const table = getTableHook(tableType).useTableContext();

  const buttonSize: ButtonProps["size"] =
    size ?? (children ? "default" : "icon");

  const hotkey = shortcut === "default" ? TABLE_RESET_DEFAULT_HOTKEY : shortcut;

  useHotkey(
    hotkey ?? TABLE_RESET_DEFAULT_HOTKEY,
    () => {
      table.reset();
      table.setGlobalFilter("");
    },
    { enabled: !!hotkey },
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ResetButton
            size={buttonSize}
            variant={variant}
            onClick={(e) => {
              table.reset();
              table.setGlobalFilter("");
              onClick?.(e);
            }}
            {...props}
          >
            {children}
          </ResetButton>
        }
      />

      <TooltipPopup align={align}>
        Reset Table
        {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
      </TooltipPopup>
    </Tooltip>
  );
}

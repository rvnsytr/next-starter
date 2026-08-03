"use client";

import { ButtonProps, ResetButton } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { dataTable } from "../hooks/data-table";

export type ResetProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "R" */
  shortcut?: "default" | Hotkey;
};

export const TABLE_RESET_DEFAULT_HOTKEY: Hotkey = "R";

export function Reset({
  hotkey,
  align = "center",
  size,
  variant = "outline",
  children,
  ...props
}: ResetProps & { hotkey?: Hotkey }) {
  const buttonSize: ButtonProps["size"] =
    size ?? (children ? "default" : "icon");

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ResetButton size={buttonSize} variant={variant} {...props}>
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

export function DataTableReset({ shortcut, onClick, ...props }: ResetProps) {
  const table = dataTable.useTableContext();

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
    <Reset
      shortcut={shortcut}
      hotkey={hotkey}
      onClick={(e) => {
        table.reset();
        table.setGlobalFilter("");
        onClick?.(e);
      }}
      {...props}
    />
  );
}

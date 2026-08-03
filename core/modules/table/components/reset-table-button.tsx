"use client";

import { ButtonProps, ResetButton } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { coreTable } from "../hooks/core-table";

export type ResetTableButtonProps = ButtonProps & {
  shortcut?: "default" | Hotkey;
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export const TABLE_RESET_DEFAULT_HOTKEY: Hotkey = "R";

export function ResetTableButton({
  hotkey,
  align = "center",
  size = "icon",
  variant = "outline",
  ...props
}: ResetTableButtonProps & { hotkey?: Hotkey }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<ResetButton size={size} variant={variant} {...props} />}
      />

      <TooltipPopup align={align}>
        Reset Table
        {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
      </TooltipPopup>
    </Tooltip>
  );
}

export function CoreTableResetTableButton({
  shortcut,
  onClick,
  ...props
}: ResetTableButtonProps) {
  const table = coreTable.useTableContext();

  const hotkey = shortcut === "default" ? TABLE_RESET_DEFAULT_HOTKEY : shortcut;

  useHotkey(hotkey ?? TABLE_RESET_DEFAULT_HOTKEY, () => table.reset(), {
    enabled: !!hotkey,
  });

  return (
    <ResetTableButton
      shortcut={shortcut}
      hotkey={hotkey}
      onClick={(e) => {
        table.reset();
        onClick?.(e);
      }}
      {...props}
    />
  );
}

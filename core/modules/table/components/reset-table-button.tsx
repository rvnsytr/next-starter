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
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "R" */
  shortcut?: "default" | Hotkey;
};

export const TABLE_RESET_DEFAULT_HOTKEY: Hotkey = "R";

export function ResetTableButton({
  hotkey,
  align = "center",
  size,
  variant = "outline",
  children,
  ...props
}: ResetTableButtonProps & { hotkey?: Hotkey }) {
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

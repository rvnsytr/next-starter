import { useDataGrid } from "./provider";

import { Button, ButtonProps } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import {
  formatForDisplay,
  HotkeySequence,
  useHotkeySequence,
} from "@tanstack/react-hotkeys";
import { ListXIcon } from "lucide-react";

export type ClearChangesButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /**
   * Keyboard shortcut used to trigger the table reset action.
   * If set to "default", the default shortcut (Alt+Z) is used.
   */
  shortcut?: "default" | HotkeySequence;
};

const DEFAULT_SHORTCUT: HotkeySequence = ["Alt+Z"];

export function DataGridClearChangesButton({
  shortcut,
  align = "center",
  size = "default",
  variant = "destructive-outline",
  onClick,
  ...props
}: ClearChangesButtonProps) {
  const table = dataGrid.useTableContext();
  const { getChanges, clearChanges } = useDataGrid();

  const onReset = () => {
    clearChanges();
    table.options.meta?.onChange?.(getChanges());
  };

  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkeySequence(hotkeySequence ?? DEFAULT_SHORTCUT, () => onReset(), {
    enabled: !!hotkeySequence,
  });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={size}
            variant={variant}
            onClick={(e) => {
              onReset();
              onClick?.(e);
            }}
            {...props}
          >
            <ListXIcon /> Discard
          </Button>
        }
      />

      <TooltipPopup align={align}>
        Reset All Changes
        {hotkeySequence && (
          <Kbd className="ml-1">
            {hotkeySequence.map((k) => formatForDisplay(k)).join("+")}
          </Kbd>
        )}
      </TooltipPopup>
    </Tooltip>
  );
}

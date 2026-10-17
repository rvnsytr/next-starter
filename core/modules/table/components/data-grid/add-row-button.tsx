import { useDataGrid } from "./provider";

import { Button, ButtonProps } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { ListPlusIcon } from "lucide-react";
import { useCallback } from "react";

export type DataGridAddRowButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /**
   * Keyboard shortcut used to trigger the table add new row action.
   * If set to "default", the default shortcut (Alt+N) is used.
   */
  shortcut?: "default" | Hotkey;
};

const DEFAULT_SHORTCUT: Hotkey = ["Alt+N"];

export function DataGridAddRowButton({
  shortcut,
  align = "center",
  size = "default",
  variant = "outline",
  onClick,
  children,
  ...props
}: DataGridAddRowButtonProps) {
  const table = dataGrid.useTableContext();
  const { getChanges, newRows } = useDataGrid();

  const addNewRow = useCallback(() => {
    newRows.fieldArray.append(table.options.meta?.getDefaultValues());
    table.options.meta?.onEditChange?.(getChanges());

    const focusedCell = table.getFocusedCell();

    if (focusedCell) {
      setTimeout(() => {
        const rowId = focusedCell.row.id;
        const columnId = focusedCell.column.id;
        table.setFocusedCell(rowId, columnId);
      }, 0);
    }
  }, [table, newRows.fieldArray, getChanges]);

  const hotkey = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkey(hotkey ?? DEFAULT_SHORTCUT, () => addNewRow(), {
    enabled: !!hotkey,
  });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={size}
            variant={variant}
            onClick={(e) => {
              onClick?.(e);
              addNewRow();
            }}
            {...props}
          >
            {children ?? (
              <>
                <ListPlusIcon /> Add Row
              </>
            )}
          </Button>
        }
      />

      <TooltipPopup align={align}>
        Add New Row
        {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
      </TooltipPopup>
    </Tooltip>
  );
}

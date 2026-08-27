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
import { ListPlusIcon } from "lucide-react";
import { useCallback } from "react";

export type AddRowButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /**
   * Keyboard shortcut used to trigger the table add new row action.
   * If set to "default", the default shortcut (Alt+N) is used.
   */
  shortcut?: "default" | HotkeySequence;
};

const DEFAULT_SHORTCUT: HotkeySequence = ["Alt+N"];

export function DataGridAddRowButton({
  shortcut,
  align = "center",
  size = "default",
  variant = "outline",
  onClick,
  ...props
}: AddRowButtonProps) {
  const table = dataGrid.useTableContext();
  const { getChanges, newRows } = useDataGrid();

  const addNewRow = useCallback(() => {
    newRows.fieldArray.append(table.options.meta?.defaultValues);
    const currentChanges = getChanges();
    table.options.meta?.onChange?.(currentChanges);

    const focusedCell = table.getFocusedCell();

    if (focusedCell) {
      setTimeout(() => {
        const rowId = focusedCell.row.id;
        const columnId = focusedCell.column.id;
        table.setFocusedCell(rowId, columnId);
      }, 0);
    }
  }, [table, newRows.fieldArray, getChanges]);

  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkeySequence(hotkeySequence ?? DEFAULT_SHORTCUT, () => addNewRow(), {
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
              addNewRow();
              onClick?.(e);
            }}
            {...props}
          >
            <ListPlusIcon /> Add Row
          </Button>
        }
      />

      <TooltipPopup align={align}>
        Add New Row
        {hotkeySequence && (
          <Kbd className="ml-1">
            {hotkeySequence.map((k) => formatForDisplay(k)).join("+")}
          </Kbd>
        )}
      </TooltipPopup>
    </Tooltip>
  );
}

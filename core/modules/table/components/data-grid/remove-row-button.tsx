import {
  Button,
  ButtonIconSize,
  ButtonProps,
} from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { cn } from "cn";
import { LucideIcon, UndoIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import { useDataGrid } from "./provider";

export type DataGridRemoveRowButtonProps = Omit<
  ButtonProps,
  "size" | "variant" | "children"
> & {
  size?: ButtonIconSize;

  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /** @default "outline" */
  undoVariant?: ButtonProps["variant"];

  /** @default "Undo Remove Row" */
  undoLabel?: string;

  /** @default UndoIcon */
  undoIcon?: LucideIcon;

  /** @default "destructive-outline" */
  removeVariant?: ButtonProps["variant"];

  /** @default "Remove Row" */
  removeLabel?: string;

  /** @default XIcon */
  removeIcon?: LucideIcon;
};

export function DataGridRemoveRowButton({
  align = "center",
  undoVariant = "outline",
  undoLabel = "Undo Remove Row",
  undoIcon: UndoIconProp = UndoIcon,
  removeVariant = "destructive-outline",
  removeLabel = "Remove Row",
  removeIcon: RemoveIconProp = XIcon,
  disabled = false,
  onClick,
  ...props
}: DataGridRemoveRowButtonProps) {
  const { table, row } = dataGrid.useCellContext();
  const dataGridContext = useDataGrid();

  const rowChanges = useMemo(
    () => dataGridContext.getChanges(),
    [dataGridContext],
  );

  const canRemove = useMemo(
    () =>
      table.options.meta?.enableCellRemoveForRow === undefined ||
      (typeof table.options.meta.enableCellRemoveForRow === "boolean" &&
        table.options.meta.enableCellRemoveForRow) ||
      (typeof table.options.meta.enableCellRemoveForRow === "function" &&
        table.options.meta.enableCellRemoveForRow(row.original)),
    [row.original, table.options.meta],
  );

  const isRowRemoved = useMemo(() => {
    const removedRowIds = new Set(rowChanges.removed.map((r) => r.rowId));
    return removedRowIds.has(row.id);
  }, [row.id, rowChanges.removed]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={isRowRemoved ? undoVariant : removeVariant}
            disabled={disabled || !canRemove}
            onClick={(e) => {
              onClick?.(e);

              if (!canRemove) return;

              const addedRowIndex = dataGridContext.newRows.form
                .getValues("rows")
                .findIndex((r, i) => table.options.getRowId?.(r, i) === row.id);

              if (addedRowIndex >= 0) {
                dataGridContext.newRows.fieldArray.remove(addedRowIndex);
                table.options.meta?.onEditChange?.(
                  dataGridContext.getChanges(),
                );
                return;
              }

              dataGridContext.removeRows([
                { rowId: row.id, rowData: row.original },
              ]);
            }}
            {...props}
          >
            <span className="relative">
              <UndoIconProp
                className={cn(
                  "transition-transform",
                  isRowRemoved ? "scale-0" : "scale-100",
                )}
              />

              <RemoveIconProp
                className={cn(
                  "absolute inset-0 transition-transform",
                  isRowRemoved ? "scale-100" : "scale-0",
                )}
              />
            </span>
          </Button>
        }
      />

      <TooltipPopup align={align}>
        {isRowRemoved ? undoLabel : removeLabel}
      </TooltipPopup>
    </Tooltip>
  );
}

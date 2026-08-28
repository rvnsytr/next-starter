import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { RowCheckbox, RowCheckboxProps } from "../base/row-checkbox";

export function DataGridSelectRowCheckbox({
  disabled = false,
  ...props
}: RowCheckboxProps) {
  const table = dataGrid.useTableContext();
  const cell = dataGrid.useCellContext();
  return (
    <table.Subscribe selector={(s) => s.rowSelection[cell.row.id] ?? false}>
      {(selected) => (
        <RowCheckbox
          checked={selected}
          onCheckedChange={(value) => cell.row.toggleSelected(!!value)}
          disabled={disabled || !cell.row.getCanSelect()}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}

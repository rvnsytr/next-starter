import { dataTable } from "@/core/modules/table/hooks/data-table";
import { RowCheckbox, RowCheckboxProps } from "../base/row-checkbox";

export function DataTableRowCheckbox({
  disabled = false,
  ...props
}: RowCheckboxProps) {
  const table = dataTable.useTableContext();
  const cell = dataTable.useCellContext();
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

import { dataTable } from "@/core/modules/table/hooks/data-table";
import {
  SelectRowCheckbox,
  SelectRowCheckboxProps,
} from "../base/select-row-checkbox";

export function DataTableSelectRowCheckbox({
  disabled = false,
  ...props
}: SelectRowCheckboxProps) {
  const table = dataTable.useTableContext();
  const cell = dataTable.useCellContext();
  return (
    <table.Subscribe selector={(s) => s.rowSelection[cell.row.id] ?? false}>
      {(selected) => (
        <SelectRowCheckbox
          checked={selected}
          onCheckedChange={(v) => cell.row.toggleSelected(v)}
          disabled={disabled || !cell.row.getCanSelect()}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}

import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import {
  SelectRowCheckbox,
  SelectRowCheckboxProps,
} from "../base/select-row-checkbox";

export function DataGridSelectRowCheckbox({
  disabled = false,
  ...props
}: SelectRowCheckboxProps) {
  const table = dataGrid.useTableContext();
  const cell = dataGrid.useCellContext();
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

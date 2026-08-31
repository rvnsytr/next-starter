import { dataController } from "@/core/modules/table/hooks/data-controller";
import {
  SelectRowCheckbox,
  SelectRowCheckboxProps,
} from "../base/select-row-checkbox";

export function DataControllerSelectRowCheckbox({
  disabled = false,
  ...props
}: SelectRowCheckboxProps) {
  const table = dataController.useTableContext();
  const cell = dataController.useCellContext();
  return (
    <table.Subscribe selector={(s) => s.rowSelection[cell.row.id] ?? false}>
      {(selected) => (
        <SelectRowCheckbox
          checked={selected}
          onCheckedChange={(value) => cell.row.toggleSelected(!!value)}
          disabled={disabled || !cell.row.getCanSelect()}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}

import { dataController } from "@/core/modules/table/hooks/data-controller";
import {
  SelectAllCheckbox,
  SelectAllCheckboxProps,
} from "../base/select-all-checkbox";

export function DataControllerSelectAllCheckbox(props: SelectAllCheckboxProps) {
  const table = dataController.useTableContext();
  return (
    <table.Subscribe selector={(s) => s.rowSelection}>
      {() => {
        const isAllRowsSelected = table.getIsAllRowsSelected();
        const isSomePageRowsSelected = table.getIsSomePageRowsSelected();
        return (
          <SelectAllCheckbox
            checked={isAllRowsSelected}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            indeterminate={!isAllRowsSelected && isSomePageRowsSelected}
            {...props}
          />
        );
      }}
    </table.Subscribe>
  );
}

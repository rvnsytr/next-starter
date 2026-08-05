import { Checkbox } from "@/core/components/ui/checkbox";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";

export type SelectAllCheckboxProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange" | "indeterminate"
>;

export function SelectAllCheckbox({
  tableType,
  ...props
}: SelectAllCheckboxProps & { tableType: DataTableType }) {
  const table = getTableHook(tableType).useTableContext();

  const isAllRowsSelected = table.getIsAllRowsSelected();

  return (
    <Checkbox
      aria-label="Select all"
      checked={isAllRowsSelected}
      onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
      indeterminate={!isAllRowsSelected && table.getIsSomePageRowsSelected()}
      {...props}
    />
  );
}

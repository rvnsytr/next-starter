import { Checkbox } from "@/core/components/ui/checkbox";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";

export type RowCheckboxProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange"
>;

export function RowCheckbox({
  tableType,
  disabled,
  ...props
}: React.ComponentProps<typeof Checkbox> & { tableType: DataTableType }) {
  const cell = getTableHook(tableType).useCellContext();
  return (
    <Checkbox
      aria-label="Select row"
      checked={cell.row.getIsSelected()}
      onCheckedChange={(value) => cell.row.toggleSelected(!!value)}
      disabled={disabled || !cell.row.getCanSelect()}
      {...props}
    />
  );
}

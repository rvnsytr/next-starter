import { Checkbox } from "@/core/components/ui/checkbox";
import { dataTable } from "../hooks/data-table";

export function DataTableColumnCellCheckbox({
  disabled,
  ...props
}: React.ComponentProps<typeof Checkbox>) {
  const cell = dataTable.useCellContext();
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

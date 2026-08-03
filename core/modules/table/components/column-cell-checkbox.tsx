import { Checkbox } from "@/core/components/ui/checkbox";
import { cn } from "@/core/utils";
import { dataTable } from "../hooks/data-table";

export function DataTableColumnCellCheckbox({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof Checkbox>) {
  const cell = dataTable.useCellContext();
  return (
    <Checkbox
      aria-label="Select row"
      checked={cell.row.getIsSelected()}
      onCheckedChange={(value) => cell.row.toggleSelected(!!value)}
      className={cn("mx-auto", className)}
      disabled={disabled || !cell.row.getCanSelect()}
      {...props}
    />
  );
}

import { Checkbox } from "@/core/components/ui/checkbox";
import { cn } from "@/core/utils";
import { dataTable } from "../hooks/data-table";

export function DataTableColumnHeaderCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof Checkbox>) {
  const table = dataTable.useTableContext();

  const isAllRowsSelected = table.getIsAllRowsSelected();

  return (
    <Checkbox
      aria-label="Select all"
      indeterminate={!isAllRowsSelected && table.getIsSomePageRowsSelected()}
      checked={isAllRowsSelected}
      onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
      className={cn("mx-auto", className)}
      {...props}
    />
  );
}

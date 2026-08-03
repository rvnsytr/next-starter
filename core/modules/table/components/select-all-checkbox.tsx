import { Checkbox } from "@/core/components/ui/checkbox";
import { dataTable } from "../hooks/data-table";

export function DataTableSelectAllCheckbox({
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
      {...props}
    />
  );
}

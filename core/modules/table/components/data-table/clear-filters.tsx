import { dataTable } from "@/core/modules/table/hooks/data-table";
import { ClearFilters, ClearFiltersProps } from "../base/clear-filters";

export function DataTableClearFilters(props: ClearFiltersProps) {
  const table = dataTable.useTableContext();
  return (
    <ClearFilters
      context={{
        onClear: () => {
          table.setColumnFilters([]);
          table.setGlobalFilter("");
        },
      }}
      {...props}
    />
  );
}

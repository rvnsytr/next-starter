import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { ClearFilters, ClearFiltersProps } from "../base/clear-filters";

export function DataGridClearFilters(props: ClearFiltersProps) {
  const table = dataGrid.useTableContext();
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

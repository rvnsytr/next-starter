import { dataController } from "@/core/modules/table/hooks/data-controller";
import { ClearFilters, ClearFiltersProps } from "../base/clear-filters";

export function DataControllerClearFilters(props: ClearFiltersProps) {
  const table = dataController.useTableContext();
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

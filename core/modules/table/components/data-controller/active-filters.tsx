import { dataController } from "@/core/modules/table/hooks/data-controller";
import { resolveFilter } from "@/core/modules/table/utils";
import { ActiveFilters, ActiveFiltersProps } from "../base/active-filters";

export function DataControllerActiveFilters(props: ActiveFiltersProps) {
  const table = dataController.useTableContext();
  return (
    <table.Subscribe selector={(s) => s.columnFilters}>
      {(filters) => (
        <ActiveFilters
          contexts={filters.map((f) => {
            const column = table.getColumn(f.id);
            if (!column) return { success: false, id: f.id, type: "column" };

            const filter = resolveFilter({
              filterFn: column.columnDef.filterFn,
              columnFilterValue: column.getFilterValue(),
            });

            if (!filter.success)
              return { ...filter, id: f.id, type: "validation" };

            return {
              success: true,
              columnId: column.id,
              setFilter: (v) => column.setFilterValue(v),
              columnMeta: column.columnDef.meta,
              ...filter.data,
            };
          })}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}

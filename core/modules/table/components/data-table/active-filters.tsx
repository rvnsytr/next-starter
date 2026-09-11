import { dataTable } from "@/core/modules/table/hooks/data-table";
import { resolveFilter } from "@/core/modules/table/utils";
import { ActiveFilters, ActiveFiltersProps } from "../base/active-filters";

export function DataTableActiveFilters(props: ActiveFiltersProps) {
  const table = dataTable.useTableContext();
  return (
    <table.Subscribe
      selector={(s) => new Set(s.columnFilters.map((filter) => filter.id))}
    >
      {(columnFilterIds) => (
        <ActiveFilters
          contexts={Array.from(columnFilterIds).map((id) => {
            const column = table.getColumn(id);
            if (!column) return { success: false, id, type: "column" };

            const filter = resolveFilter({
              filterFn: column.columnDef.filterFn,
              columnFilterValue: column.getFilterValue(),
            });

            if (!filter.success) return { ...filter, id, type: "validation" };

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

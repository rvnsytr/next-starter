import { dataTable } from "@/core/modules/table/hooks/data-table";
import { resolveColumnFilter } from "@/core/modules/table/utils";
import { ActiveFilters, ActiveFiltersProps } from "../base/active-filters";

export function DataTableActiveFilters(props: ActiveFiltersProps) {
  const table = dataTable.useTableContext();
  return (
    <table.Subscribe
      selector={(s) => new Set(s.columnFilters.map((filter) => filter.id))}
    >
      {(columnFilterIds) => (
        <ActiveFilters
          columns={Array.from(columnFilterIds).map((id) => {
            const column = table.getColumn(id);
            if (!column) return { success: false, id, type: "column" };

            const resolvedFilter = resolveColumnFilter({
              filterFn: column.columnDef.filterFn,
              columnFilterValue: column.getFilterValue(),
              columnMeta: column.columnDef.meta,
              getFacetedUniqueValues: () => column.getFacetedUniqueValues(),
              getFacetedMinMaxValues: () => column.getFacetedMinMaxValues(),
            });

            if (!resolvedFilter.success)
              return { ...resolvedFilter, id: column.id, type: "validation" };

            return {
              success: true,
              columnId: column.id,
              setFilter: (v) => column.setFilterValue(v),
              ...resolvedFilter.data,
            };
          })}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}

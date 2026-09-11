import { dataTable } from "@/core/modules/table/hooks/data-table";
import { resolveColumnFilter } from "@/core/modules/table/utils";
import { FilterSelector, FilterSelectorProps } from "../base/filter-selector";

export function DataTableFilterSelector(props: FilterSelectorProps) {
  const table = dataTable.useTableContext();
  return (
    <table.Subscribe
      selector={(s) => new Set(s.columnFilters.map((filter) => filter.id))}
    >
      {(columnFilterIds) => (
        <FilterSelector
          context={{
            columnFilterIds,
            columns: table
              .getAllColumns()
              .filter((c) => c.getCanFilter())
              .map((c) => {
                const resolvedFilter = resolveColumnFilter({
                  filterFn: c.columnDef.filterFn,
                  columnFilterValue: c.getFilterValue(),
                  columnMeta: c.columnDef.meta,
                  getFacetedUniqueValues: () => c.getFacetedUniqueValues(),
                  getFacetedMinMaxValues: () => c.getFacetedMinMaxValues(),
                });

                if (!resolvedFilter.success)
                  return { ...resolvedFilter, id: c.id, type: "validation" };

                return {
                  success: true,
                  columnId: c.id,
                  setFilter: (v) => c.setFilterValue(v),
                  ...resolvedFilter.data,
                };
              }),
          }}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}

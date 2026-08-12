import { dataTable } from "@/core/modules/table/hooks/data-table";
import { resolveFilter } from "@/core/modules/table/utils";
import {
  ActiveFilters,
  ActiveFiltersProps,
  FilterSelector,
  FilterSelectorProps,
} from "../base/filters";

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
              .filter((column) => column.getCanFilter())
              .map((column) => {
                const filter = resolveFilter({
                  filterFn: column.columnDef.filterFn,
                  columnFilterValue: column.getFilterValue(),
                  safeParse: true,
                });

                if (!filter.success) return { success: false, id: column.id };

                return {
                  success: true,
                  id: column.id,
                  setFilter: (v) => column.setFilterValue(v),
                  columnMeta: column.columnDef.meta,
                  ...filter.data,
                };
              }),
          }}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}

export function DataTableActiveFilters(props: ActiveFiltersProps) {
  const table = dataTable.useTableContext();
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
              id: f.id,
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

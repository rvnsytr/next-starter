import { dataController } from "@/core/modules/table/hooks/data-controller";
import {
  isScalarColumnType,
  resolveColumnOptions,
  resolveFilter,
} from "@/core/modules/table/utils";
import {
  ActiveFilters,
  ActiveFiltersProps,
  FilterSelector,
  FilterSelectorProps,
} from "../base/filters";

export function DataControllerFilterSelector(props: FilterSelectorProps) {
  const table = dataController.useTableContext();
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
                const filter = resolveFilter({
                  filterFn: c.columnDef.filterFn,
                  columnFilterValue: c.getFilterValue(),
                  safeParse: true,
                });

                if (!filter.success)
                  return { ...filter, id: c.id, type: "validation" };

                const { filterValue, popupType } = filter.data;

                const column = table.getColumn(c.id);
                if (!column)
                  return { success: false, id: c.id, type: "column" };

                const meta = c.columnDef.meta ?? {};
                const options = isScalarColumnType(filterValue.type)
                  ? resolveColumnOptions(
                      column.getFacetedUniqueValues().entries(),
                      meta.options,
                    )
                  : [];

                const columnMeta = { ...meta, options };

                return {
                  success: true,
                  columnId: c.id,
                  popupType,
                  filterValue,
                  setFilter: (v) => c.setFilterValue(v),
                  columnMeta,
                };
              }),
          }}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}

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

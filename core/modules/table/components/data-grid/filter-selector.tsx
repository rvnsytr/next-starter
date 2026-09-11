import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import {
  isScalarColumnType,
  resolveColumnOptions,
  resolveFilter,
} from "@/core/modules/table/utils";
import { FilterSelector, FilterSelectorProps } from "../base/filter-selector";

export function DataGridFilterSelector(props: FilterSelectorProps) {
  const table = dataGrid.useTableContext();
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
                const resolvedFilter = resolveFilter({
                  filterFn: c.columnDef.filterFn,
                  columnFilterValue: c.getFilterValue(),
                  safeParse: true,
                });

                if (!resolvedFilter.success)
                  return { ...resolvedFilter, id: c.id, type: "validation" };

                const { filter, popupType } = resolvedFilter.data;

                const column = table.getColumn(c.id);
                if (!column)
                  return { success: false, id: c.id, type: "column" };

                const meta = c.columnDef.meta ?? {};
                const options = isScalarColumnType(filter.type)
                  ? resolveColumnOptions(
                      column.getFacetedUniqueValues().entries(),
                      meta.options,
                    )
                  : [];

                const columnMeta = { ...meta, options };

                return {
                  success: true,
                  columnId: c.id,
                  filter,
                  setFilter: (v) => c.setFilterValue(v),
                  popupType,
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

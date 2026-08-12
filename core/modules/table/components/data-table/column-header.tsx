import { dataTable } from "@/core/modules/table/hooks/data-table";
import {
  ColumnHeader,
  ColumnHeaderProps,
  ColumnHeaderState,
} from "../base/column-header";

export function DataTableColumnHeader(props: ColumnHeaderProps) {
  const table = dataTable.useTableContext();
  const { column } = dataTable.useHeaderContext();

  const columnId = column.id;
  const canSort = column.getCanSort();
  const canPin = column.getCanPin();

  return (
    <table.Subscribe
      selector={(s): ColumnHeaderState => {
        const sort = s.sorting.find((cs) => cs.id === columnId);
        const isPinStart = s.columnPinning.start?.includes(columnId);
        const isPinEnd = s.columnPinning.end?.includes(columnId);
        return {
          sortDirection: sort ? (sort.desc ? "desc" : "asc") : false,
          pinPosition: isPinStart ? "start" : isPinEnd ? "end" : false,
        };
      }}
    >
      {(state) => (
        <ColumnHeader
          context={{
            state,
            column: {
              id: columnId,
              meta: column.columnDef.meta,
              canSort,
              canPin,
              sortControl: {
                value: state.sortDirection || "default",
                onValueChange: (v) => {
                  if (v === "default" || state.sortDirection === v)
                    column.clearSorting();
                  else column.toggleSorting(v === "desc", true);
                },
              },
              pinControl: {
                value: state.pinPosition || "default",
                onValueChange: (v) => {
                  if (v === "default" || state.pinPosition === v)
                    column.pin(false);
                  else column.pin(v as "start" | "end");
                },
              },
            },
          }}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}

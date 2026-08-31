import { dataController } from "@/core/modules/table/hooks/data-controller";
import {
  ColumnHeader,
  ColumnHeaderProps,
  ColumnHeaderState,
} from "../base/column-header";

export function DataControllerColumnHeader(props: ColumnHeaderProps) {
  const table = dataController.useTableContext();
  const { column } = dataController.useHeaderContext();

  const columnId = column.id;
  const canSort = column.getCanSort();

  return (
    <table.Subscribe
      selector={(s): ColumnHeaderState => {
        const sort = s.sorting.find((cs) => cs.id === columnId);
        return {
          sortDirection: sort ? (sort.desc ? "desc" : "asc") : false,
          pinPosition: false,
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
              sortControl: {
                value: state.sortDirection || "default",
                onValueChange: (v) => {
                  if (v === "default" || state.sortDirection === v)
                    column.clearSorting();
                  else column.toggleSorting(v === "desc", true);
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

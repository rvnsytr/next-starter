import { MenuCheckboxItem } from "@/core/components/ui/menu";
import { SORT_ICONS } from "@/core/modules/table/constants";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { getSortingSelector, sortingHandler } from "@/core/modules/table/utils";
import { SortDirection } from "@tanstack/react-table";
import {
  ColumnSortMenu,
  ColumnSortMenuItemContent,
  ColumnSortMenuProps,
} from "../base/column-sort-menu";

export default function DataTableColumnSortMenu(props: ColumnSortMenuProps) {
  const table = dataTable.useTableContext();
  return (
    <ColumnSortMenu
      renderPopupContent={table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => (
          <table.Subscribe
            key={column.id}
            selector={(s): SortDirection | null => {
              return getSortingSelector(column.id, s.sorting);
            }}
          >
            {(sortDirection) => {
              const CheckIcon = sortDirection
                ? SORT_ICONS[sortDirection]
                : SORT_ICONS.default;

              return (
                <MenuCheckboxItem
                  checked={Boolean(sortDirection)}
                  onCheckedChange={() => {
                    sortingHandler({
                      sortDirection,
                      toggleSortingControl: (desc, isMulti) =>
                        column.toggleSorting(desc, isMulti),
                      clearSortingControl: () => column.clearSorting(),
                    });
                  }}
                  checkIcon={<CheckIcon />}
                >
                  <ColumnSortMenuItemContent
                    columnId={column.id}
                    meta={column.columnDef.meta}
                  />
                </MenuCheckboxItem>
              );
            }}
          </table.Subscribe>
        ))}
      {...props}
    />
  );
}

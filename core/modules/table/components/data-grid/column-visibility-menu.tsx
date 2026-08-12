import { MenuCheckboxItem } from "@/core/components/ui/menu";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import {
  ColumnVisibilityMenu,
  ColumnVisibilityMenuItemContent,
  ColumnVisibilityMenuProps,
} from "../base/column-visibility-menu";

export function DataGridColumnVisibilityMenu(props: ColumnVisibilityMenuProps) {
  const table = dataGrid.useTableContext();
  return (
    <ColumnVisibilityMenu
      renderPopupContent={table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => (
          <table.Subscribe
            key={column.id}
            selector={(s) => s.columnVisibility[column.id] ?? true}
          >
            {(isVisible) => (
              <MenuCheckboxItem
                checked={isVisible}
                onCheckedChange={(value) => {
                  column.toggleVisibility(!!value);
                }}
              >
                <ColumnVisibilityMenuItemContent
                  columnId={column.id}
                  meta={column.columnDef.meta}
                />
              </MenuCheckboxItem>
            )}
          </table.Subscribe>
        ))}
      {...props}
    />
  );
}

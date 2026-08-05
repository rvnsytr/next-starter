import { createTableHook, tableFeatures } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumnFilters,
  DataTableColumnSortMenu,
  DataTableColumnVisibilityMenu,
  DataTablePageSizeSelector,
  DataTablePagination,
  DataTablePinMenu,
  DataTableReset,
  DataTableRowCheckbox,
  DataTableRowNumber,
  DataTableSearch,
  DataTableSelectAllCheckbox,
  DataTableSortButton,
} from "../components/data-table";
import { dataTableFeatures } from "../features/data-table";
import { CellComponents, HeaderComponents, TableComponents } from "../types";

export const dataTable = createTableHook({
  features: tableFeatures(dataTableFeatures),
  tableComponents: {
    Table: DataTable,
    ColumnFilters: DataTableColumnFilters,
    ColumnSortMenu: DataTableColumnSortMenu,
    ColumnVisibilityMenu: DataTableColumnVisibilityMenu,
    PageSizeSelector: DataTablePageSizeSelector,
    Pagination: DataTablePagination,
    Reset: DataTableReset,
    Search: DataTableSearch,
  } satisfies TableComponents,
  headerComponents: {
    PinMenu: DataTablePinMenu,
    SelectAllCheckbox: DataTableSelectAllCheckbox,
    SortButton: DataTableSortButton,
  } satisfies HeaderComponents,
  cellComponents: {
    RowCheckbox: DataTableRowCheckbox,
    RowNumber: DataTableRowNumber,
  } satisfies CellComponents,
});

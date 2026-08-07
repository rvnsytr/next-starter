import { createTableHook, tableFeatures } from "@tanstack/react-table";
import { ActiveFiltersContainer } from "../components/base/filters";
import {
  DataTable,
  DataTableActiveFilters,
  DataTableClearFilters,
  DataTableColumnSortMenu,
  DataTableColumnVisibilityMenu,
  DataTableFilterSelector,
  DataTablePageSizeSelector,
  DataTablePagination,
  DataTablePinMenu,
  DataTableResetTableButton,
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
    ActiveFilters: DataTableActiveFilters,
    ActiveFiltersContainer,
    ClearFilters: DataTableClearFilters,
    ColumnFilters: DataTableFilterSelector,
    ColumnSortMenu: DataTableColumnSortMenu,
    ColumnVisibilityMenu: DataTableColumnVisibilityMenu,
    PageSizeSelector: DataTablePageSizeSelector,
    Pagination: DataTablePagination,
    ResetTableButton: DataTableResetTableButton,
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

import { createTableHook, tableFeatures } from "@tanstack/react-table";
import { ActiveFiltersContainer } from "../components/base/filters";
import {
  DataTable,
  DataTableActiveFilters,
  DataTableClearFilters,
  DataTableColumnSortMenu,
  DataTableColumnVisibilityMenu,
  DataTableFilterSelector,
  DataTableHeader,
  DataTablePageSizeSelector,
  DataTablePagination,
  DataTableResetTableButton,
  DataTableRowCheckbox,
  DataTableRowNumber,
  DataTableSearch,
  DataTableSelectAllCheckbox,
} from "../components/data-table";
import { DataTableLayout } from "../components/data-table-layout";
import { dataTableFeatures } from "../features/data-table";
import {
  CellComponents,
  DataTableTableTemplate,
  HeaderComponents,
  TableComponents,
} from "../types";

export const dataTable = createTableHook({
  features: tableFeatures(dataTableFeatures),
  tableComponents: {
    Table: DataTable,
    ActiveFilters: DataTableActiveFilters,
    ActiveFiltersContainer,
    ClearFilters: DataTableClearFilters,
    ColumnSortMenu: DataTableColumnSortMenu,
    ColumnVisibilityMenu: DataTableColumnVisibilityMenu,
    FilterSelector: DataTableFilterSelector,
    PageSizeSelector: DataTablePageSizeSelector,
    Pagination: DataTablePagination,
    ResetTableButton: DataTableResetTableButton,
    Search: DataTableSearch,
    Layout: DataTableLayout,
  } satisfies TableComponents & DataTableTableTemplate,
  headerComponents: {
    Header: DataTableHeader,
    SelectAllCheckbox: DataTableSelectAllCheckbox,
  } satisfies HeaderComponents,
  cellComponents: {
    RowCheckbox: DataTableRowCheckbox,
    RowNumber: DataTableRowNumber,
  } satisfies CellComponents,
});

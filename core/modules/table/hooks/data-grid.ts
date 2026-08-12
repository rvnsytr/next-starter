import { createTableHook, tableFeatures } from "@tanstack/react-table";
import { ActiveFiltersContainer } from "../components/base/filters";
import { DataGridClearFilters } from "../components/data-grid/clear-filters";
import { DataGridColumnHeader } from "../components/data-grid/column-header";
import { DataGridColumnSortMenu } from "../components/data-grid/column-sort-menu";
import { DataGridColumnVisibilityMenu } from "../components/data-grid/column-visibility-menu";
import {
  DataGridActiveFilters,
  DataGridFilterSelector,
} from "../components/data-grid/filters";
import { DataGridLayout } from "../components/data-grid/layout";
import { DataGridPageSizeSelector } from "../components/data-grid/page-size-selector";
import { DataGridPagination } from "../components/data-grid/pagination";
import { DataGridResetTableButton } from "../components/data-grid/reset-table-button";
import { DataGridRowCheckbox } from "../components/data-grid/row-checkbox";
import { DataGridRowNumber } from "../components/data-grid/row-number";
import { DataGridSearch } from "../components/data-grid/search";
import { DataGridSelectAllCheckbox } from "../components/data-grid/select-all-checkbox";
import { DataGrid } from "../components/data-grid/table";
import { dataGridFeatures } from "../features/data-grid";
import {
  CellComponents,
  DataGridLayouts,
  HeaderComponents,
  TableComponents,
} from "../types";

export const dataGrid = createTableHook({
  features: tableFeatures(dataGridFeatures),
  tableComponents: {
    Table: DataGrid,
    ActiveFilters: DataGridActiveFilters,
    ActiveFiltersContainer,
    ClearFilters: DataGridClearFilters,
    ColumnSortMenu: DataGridColumnSortMenu,
    ColumnVisibilityMenu: DataGridColumnVisibilityMenu,
    FilterSelector: DataGridFilterSelector,
    PageSizeSelector: DataGridPageSizeSelector,
    Pagination: DataGridPagination,
    ResetTableButton: DataGridResetTableButton,
    Search: DataGridSearch,
    Layout: DataGridLayout,
  } satisfies TableComponents & DataGridLayouts,
  headerComponents: {
    ColumnHeader: DataGridColumnHeader,
    SelectAllCheckbox: DataGridSelectAllCheckbox,
  } satisfies HeaderComponents,
  cellComponents: {
    RowCheckbox: DataGridRowCheckbox,
    RowNumber: DataGridRowNumber,
  } satisfies CellComponents,
});

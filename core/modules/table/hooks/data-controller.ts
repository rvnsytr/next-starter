import { createTableHook, tableFeatures } from "@tanstack/react-table";
import { ActiveFiltersContainer } from "../components/base/filters";
import { DataTableClearFilters } from "../components/data-table/clear-filters";
import { DataTableColumnHeader } from "../components/data-table/column-header";
import { DataTableColumnSortMenu } from "../components/data-table/column-sort-menu";
import { DataTableColumnVisibilityMenu } from "../components/data-table/column-visibility-menu";
import {
  DataTableActiveFilters,
  DataTableFilterSelector,
} from "../components/data-table/filters";
import { DataTableLayout } from "../components/data-table/layout";
import { DataTablePageSizeSelector } from "../components/data-table/page-size-selector";
import { DataTablePagination } from "../components/data-table/pagination";
import { DataTableResetTableButton } from "../components/data-table/reset-table-button";
import { DataTableRowNumber } from "../components/data-table/row-number";
import { DataTableSearch } from "../components/data-table/search";
import { DataTableSelectAllCheckbox } from "../components/data-table/select-all-checkbox";
import { DataTableSelectRowCheckbox } from "../components/data-table/select-row-checkbox";
import { DataTable } from "../components/data-table/table";
import { dataControllerFeatures } from "../features/data-controller";
import {
  DataTableTableComponents,
  TableCellComponents,
  TableComponents,
  TableHeaderComponents,
} from "../types";

export const dataController = createTableHook({
  features: tableFeatures(dataControllerFeatures),
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
  } satisfies TableComponents & DataTableTableComponents,
  headerComponents: {
    ColumnHeader: DataTableColumnHeader,
    SelectAllCheckbox: DataTableSelectAllCheckbox,
  } satisfies TableHeaderComponents,
  cellComponents: {
    RowNumber: DataTableRowNumber,
    SelectRowCheckbox: DataTableSelectRowCheckbox,
  } satisfies TableCellComponents,
});

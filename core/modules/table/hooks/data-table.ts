import {
  columnFilteringFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_includesString,
  filterFn_inNumberRange,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  TableFeatures,
  tableFeatures,
} from "@tanstack/react-table";
import { DataTableColumnCellCheckbox } from "../components/column-cell-checkbox";
import { DataTableColumnHeaderCheckbox } from "../components/column-header-checkbox";
import { DataTableColumnSortButton } from "../components/column-sort-button";
import { DataTableColumnSortMenu } from "../components/column-sort-menu";
import { DataTableColumnVisibilityMenu } from "../components/column-visibility-menu";
import { DataTablePageSizeSelector } from "../components/page-size-selector";
import { DataTablePagination } from "../components/pagination";
import { DataTableReset } from "../components/reset";
import { DataTableSearch } from "../components/search";
import { DataTable } from "../components/tables/data-table";
import { TableMeta } from "../types";

export const dataTableFeatures: TableFeatures = {
  columnVisibilityFeature,
  rowSelectionFeature,

  columnSizingFeature,
  columnResizingFeature,

  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),

  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
  },

  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
};

export const dataTable = createTableHook({
  features: tableFeatures({
    ...dataTableFeatures,
    columnMeta: metaHelper<TableMeta>(),
  }),
  tableComponents: {
    Table: DataTable,
    Search: DataTableSearch,
    Pagination: DataTablePagination,
    PageSizeSelector: DataTablePageSizeSelector,
    ColumnVisibilityMenu: DataTableColumnVisibilityMenu,
    ColumnSortMenu: DataTableColumnSortMenu,
    Reset: DataTableReset,
  },
  headerComponents: {
    ColumnSortButton: DataTableColumnSortButton,
    SelectAllCheckbox: DataTableColumnHeaderCheckbox,
  },
  cellComponents: {
    RowCheckbox: DataTableColumnCellCheckbox,
  },
});

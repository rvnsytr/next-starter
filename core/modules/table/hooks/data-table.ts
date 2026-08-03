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
import { DataTableVisibilityMenu } from "../components/column-visibility-menu";
import { DataTablePageSizeSelector } from "../components/page-size-selector";
import { DataTablePagination } from "../components/pagination";
import { DataTableReset } from "../components/reset";
import { DataTableRowCheckbox } from "../components/row-checkbox";
import { DataTableSearch } from "../components/search";
import { DataTableSelectAllCheckbox } from "../components/select-all-checkbox";
import { DataTableSortButton } from "../components/sort-button";
import { DataTableSortMenu } from "../components/sort-menu";
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
    PageSizeSelector: DataTablePageSizeSelector,
    Pagination: DataTablePagination,
    Reset: DataTableReset,
    Search: DataTableSearch,
    SortMenu: DataTableSortMenu,
    Table: DataTable,
    VisibilityMenu: DataTableVisibilityMenu,
  },
  headerComponents: {
    SelectAllCheckbox: DataTableSelectAllCheckbox,
    SortButton: DataTableSortButton,
  },
  cellComponents: {
    RowCheckbox: DataTableRowCheckbox,
  },
});

import {
  columnFilteringFeature,
  columnPinningFeature,
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
  tableFeatures,
} from "@tanstack/react-table";
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
import {
  CellComponents,
  HeaderComponents,
  TableComponents,
  TableMeta,
} from "../types";

export const dataTable = createTableHook({
  features: tableFeatures({
    columnPinningFeature,
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

    columnMeta: metaHelper<TableMeta>(),
  }),
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

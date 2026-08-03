import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  TableFeatures,
  tableFeatures,
} from "@tanstack/react-table";
import { CoreTableColumnSortButton } from "../components/column-sort-button";
import { CoreTableColumnSortMenu } from "../components/column-sort-menu";
import { CoreTableColumnVisibilityMenu } from "../components/column-visibility-menu";
import { CoreTablePageSize } from "../components/page-size";
import { CoreTablePagination } from "../components/pagination";
import { CoreTableResetTableButton } from "../components/reset-table-button";
import { CoreTable } from "../components/tables/core-table";
import { TableMeta } from "../types";

export const coreTableFeatures: TableFeatures = {
  columnVisibilityFeature,

  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
  },

  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
};

export const coreTable = createTableHook({
  features: tableFeatures({
    ...coreTableFeatures,
    columnMeta: metaHelper<TableMeta>(),
  }),
  tableComponents: {
    Table: CoreTable,
    ColumnVisibilityMenu: CoreTableColumnVisibilityMenu,
    ColumnSortMenu: CoreTableColumnSortMenu,
    ResetTableButton: CoreTableResetTableButton,
    Pagination: CoreTablePagination,
    PageSize: CoreTablePageSize,
  },
  headerComponents: {
    ColumnSortButton: CoreTableColumnSortButton,
  },
});

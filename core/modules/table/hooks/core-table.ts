import {
  columnVisibilityFeature,
  createSortedRowModel,
  createTableHook,
  metaHelper,
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
import { CoreTableResetTableButton } from "../components/table-reset-button";
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
  },
  headerComponents: {
    ColumnSortButton: CoreTableColumnSortButton,
  },
});

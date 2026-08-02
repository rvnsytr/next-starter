import {
  columnVisibilityFeature,
  createTableHook,
  metaHelper,
  // createSortedRowModel,
  // rowSortingFeature,
  // sortFn_alphanumeric,
  // sortFn_datetime,
  // sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";
import { DataTableColumnVisibilityMenu } from "../components/column-visibility-menu";
import { CoreTable } from "../components/tables/core-table";
import { TableMeta } from "../types";

export const coreTable = createTableHook({
  features: tableFeatures({
    columnVisibilityFeature,

    // rowSortingFeature,
    // sortedRowModel: createSortedRowModel(),
    // sortFns: {
    //   alphanumeric: sortFn_alphanumeric,
    //   text: sortFn_text,
    //   datetime: sortFn_datetime,
    // },

    columnMeta: metaHelper<TableMeta>(),
  }),
  tableComponents: {
    ColumnVisibilityMenu: DataTableColumnVisibilityMenu,
    Table: CoreTable,
  },
  cellComponents: {},
});

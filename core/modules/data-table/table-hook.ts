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
import { CellVisibilityDropdown } from "./components/cell-visibility-dropdown";
import { DataTable } from "./components/table";
import { TableMeta } from "./types";

export const dataTable = createTableHook({
  features: tableFeatures({
    // cellSelectionFeature,
    // columnPinningFeature,
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
    CellVisibilityDropdown,
    DataTable,
  },
});

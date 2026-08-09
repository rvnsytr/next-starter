import {
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  TableFeatures,
} from "@tanstack/react-table";
import { ColumnMeta } from "../types";

export const serverDataTableFeatures = {
  columnPinningFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,

  rowSelectionFeature,
  rowPaginationFeature,

  rowSortingFeature,
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
  },

  columnFilteringFeature,
  globalFilteringFeature,
  filterFns,

  columnMeta: metaHelper<ColumnMeta>(),
} satisfies TableFeatures;

export const clientDataTableFeatures = {
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
} satisfies TableFeatures;

export const dataTableFeatures = {
  ...serverDataTableFeatures,
  ...clientDataTableFeatures,
} satisfies TableFeatures;

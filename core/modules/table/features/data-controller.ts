import {
  columnFilteringFeature,
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
import {
  booleanFilterFn,
  FilterFn,
  FilterType,
  numberFilterFn,
  stringFilterFn,
} from "../filters";
import { ColumnMeta, TableMeta } from "../types";

export const serverDataControllerFeatures = {
  columnFilteringFeature,
  filterFns: {
    boolean: booleanFilterFn,
    number: numberFilterFn,
    string: stringFilterFn,
  } satisfies Record<FilterType, FilterFn>,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
} satisfies TableFeatures;

export const clientDataControllerFeatures = {
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
} satisfies TableFeatures;

export const dataControllerFeatures = {
  ...serverDataControllerFeatures,
  ...clientDataControllerFeatures,

  tableMeta: metaHelper<TableMeta>(),
  columnMeta: metaHelper<ColumnMeta>(),
} satisfies TableFeatures;

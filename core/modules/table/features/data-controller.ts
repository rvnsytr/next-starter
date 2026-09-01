import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
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
  multiOptionFilterFn,
  numberFilterFn,
  optionFilterFn,
  stringFilterFn,
} from "../filters";
import { ColumnMeta, TableMeta } from "../types";

export const serverDataControllerFeatures = {
  columnFacetingFeature,
  columnFilteringFeature,
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  filterFns: {
    string: stringFilterFn,
    number: numberFilterFn,
    boolean: booleanFilterFn,
    option: optionFilterFn,
    "multi-option": multiOptionFilterFn,
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
  facetedRowModel: createFacetedRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
} satisfies TableFeatures;

export const dataControllerFeatures = {
  ...serverDataControllerFeatures,
  ...clientDataControllerFeatures,

  tableMeta: metaHelper<TableMeta>(),
  columnMeta: metaHelper<ColumnMeta>(),
} satisfies TableFeatures;

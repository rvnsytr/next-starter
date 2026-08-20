import { ActionResponse } from "@/core/types";
import { validateValue } from "@/core/utils";
import {
  PaginationState,
  SortDirection,
  SortingState,
} from "@tanstack/react-table";
import { DEFAULT_FILTER_TYPE } from "./constants";
import { filterMeta, FilterPopupType, FilterValue } from "./filters";
import { filterTypeSchema, filterValueSchema } from "./schema";

export function calculateRowNumber(
  cellIndex: number,
  pagination: PaginationState,
  manual: boolean = false,
) {
  const pageRowNumber = cellIndex + 1;
  const absoluteRowNumber =
    pagination.pageIndex * pagination.pageSize + pageRowNumber;
  return manual ? absoluteRowNumber : pageRowNumber;
}

export function getSortingSelector(
  columnId: string,
  sortingState: SortingState,
): SortDirection | null {
  const sort = sortingState.find((s) => s.id === columnId);
  return sort ? (sort.desc ? "desc" : "asc") : null;
}

export function sortingHandler(context: {
  sortDirection: SortDirection | null;
  toggleSortingControl: (desc?: boolean, isMulti?: boolean) => void;
  clearSortingControl: () => void;
}) {
  if (context.sortDirection === "asc") context.toggleSortingControl(true, true);
  else if (context.sortDirection === "desc") context.clearSortingControl();
  else context.toggleSortingControl(false, true);
}

export function resolveFilter(params: {
  filterFn: unknown;
  columnFilterValue: unknown;
  safeParse?: boolean;
}): ActionResponse<{
  filterValue: FilterValue;
  popupType: FilterPopupType;
}> {
  const ftSchema = params.safeParse
    ? filterTypeSchema.default(DEFAULT_FILTER_TYPE).catch(DEFAULT_FILTER_TYPE)
    : filterTypeSchema;

  const parsedFilterType = validateValue(params.filterFn, ftSchema);
  if (!parsedFilterType.success) return parsedFilterType;

  const { popupType, defaultValue } = filterMeta[parsedFilterType.data];

  const fvSchema = params.safeParse
    ? filterValueSchema.default(defaultValue).catch(defaultValue)
    : filterValueSchema;

  const parsedFilterValue = validateValue(params.columnFilterValue, fvSchema);
  if (!parsedFilterValue.success) return parsedFilterValue;

  const filterValue = parsedFilterValue.data;

  return { success: true, data: { filterValue, popupType } };
}

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

export function getParentColumns<T extends { parent?: T }>(node: T): T[] {
  const parents: T[] = [];
  let current = node.parent;

  while (!!current) {
    parents.push(current);
    current = current.parent;
  }

  return parents.reverse();
}

export function hasNestedKey(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: Record<string, any>,
  key: string,
): boolean {
  return Object.entries(object).some(([currentKey, value]) => {
    if (currentKey === key) return true;
    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      hasNestedKey(value, key)
    );
  });
}

export function getNestedProperty<T = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: Record<string, any>,
  keys: string[],
): T | undefined {
  let current = object;

  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[key];
  }

  return current as T | undefined;
}

export function setNestedValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: Record<string, any>,
  keys: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
) {
  if (keys.length === 0) return object;

  const result = { ...object };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...(current[key] ?? {}) };
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeNested<T extends Record<string, any>>(
  target: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: Record<string, any>,
): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value))
      result[key] = mergeNested(result[key] ?? {}, value);
    else result[key] = value;
  }

  return result as T;
}

import { ActionResponse } from "@/core/types";
import { validateValue } from "@/core/utils";
import {
  PaginationState,
  RowData,
  SortDirection,
  SortingState,
} from "@tanstack/react-table";
import { DataGridContextValue } from "./components/data-grid/provider";
import { DEFAULT_FILTER_TYPE } from "./constants";
import { filterMeta } from "./filter-meta";
import { filterSchema, filterTypeSchema } from "./schema";
import {
  ColumnMeta,
  DataGridTableMeta,
  Filter,
  FilterPopupType,
  FilterType,
} from "./types";

export function saveChanges(
  context: DataGridContextValue,
  tableMeta?: DataGridTableMeta<RowData>,
) {
  const res = tableMeta?.onSave?.(context.getChanges()) ?? false;
  if (!res) return;
  context.clearChanges();
  tableMeta?.onChange?.(context.getChanges());
}

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

export function resolveColumnFilter({
  filterFn,
  columnFilterValue,
  columnMeta,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
}: {
  filterFn: unknown;
  columnFilterValue: unknown;
  columnMeta?: ColumnMeta;
  getFacetedUniqueValues: () => Map<string, number>;
  getFacetedMinMaxValues: () => [number, number] | undefined;
}): ActionResponse<{
  filter: Filter;
  columnMeta: ColumnMeta;
  popupType: FilterPopupType;
}> {
  const ftSchema = filterTypeSchema
    .default(DEFAULT_FILTER_TYPE)
    .catch(DEFAULT_FILTER_TYPE);

  const parsedFilterType = validateValue(filterFn, ftSchema);
  if (!parsedFilterType.success) return parsedFilterType;

  const { popupType, defaultValue } = filterMeta[parsedFilterType.data];

  const fSchema = filterSchema.default(defaultValue).catch(defaultValue);

  const parsedFilter = validateValue(columnFilterValue, fSchema);
  if (!parsedFilter.success) return parsedFilter;

  const filter = parsedFilter.data;

  let columnMetaOptions: ColumnMeta["options"] = columnMeta?.options;
  let columnMetaMin: ColumnMeta["min"] = columnMeta?.min;
  let columnMetaMax: ColumnMeta["max"] = columnMeta?.max;

  if (filter.type === "number" && (!columnMetaMin || !columnMetaMax)) {
    const facetedMinMaxValues = getFacetedMinMaxValues();
    if (facetedMinMaxValues) {
      columnMetaMin = facetedMinMaxValues[0];
      columnMetaMax = facetedMinMaxValues[1];
    }
  }

  const scalarFilterTypes: FilterType[] = ["option", "multi-option"];
  if (scalarFilterTypes.includes(filter.type) && !columnMetaOptions) {
    const facetedUniqueValues = getFacetedUniqueValues();
    columnMetaOptions = (
      columnMeta?.options ??
      [...facetedUniqueValues.entries()].map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
    ).map((option) => ({
      ...option,
      count: option.count ?? facetedUniqueValues.get(option.value) ?? 0,
    }));
  }

  return {
    success: true,
    data: {
      filter,
      popupType,
      columnMeta: {
        ...columnMeta,
        min: columnMetaMin,
        max: columnMetaMax,
        options: columnMetaOptions,
      },
    },
  };
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
    if (typeof current !== "object") return undefined;
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
  if (!keys.length) return object;

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

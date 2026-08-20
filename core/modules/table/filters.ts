import { validateValue } from "@/core/utils";
import {
  FilterFn as TanstackFilterFn,
  filterFn_between,
  filterFn_betweenInclusive,
  filterFn_empty,
  filterFn_endsWith,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_greaterThan,
  filterFn_greaterThanOrEqualTo,
  filterFn_includesString,
  filterFn_notEmpty,
  filterFn_startsWith,
} from "@tanstack/react-table";
import { z } from "better-auth";
import { NUMBER_FILTER_OPERATORS, STRING_FILTER_OPERATORS } from "./operators";
import {
  filterValueSchema,
  numberFilterValueSchema,
  stringFilterValueSchema,
} from "./schema";

export type FilterValue = z.infer<typeof filterValueSchema>;
export type FilterType = FilterValue["type"];

export type FilterPopupType = "menu" | "popover";

export type FilterMeta = {
  [T in FilterType]: {
    popupType: FilterPopupType;
    defaultValue: Extract<FilterValue, { type: T }>;
  };
};

export const filterMeta: FilterMeta = {
  string: {
    popupType: "popover",
    defaultValue: {
      type: "string",
      operator: "contains",
      value: "",
    },
  },
  number: {
    popupType: "popover",
    defaultValue: {
      type: "number",
      operator: "equals",
      value: [],
    },
  },
};

export function getFilterOperators(filterType: FilterType) {
  switch (filterType) {
    case "string":
      return STRING_FILTER_OPERATORS;
    case "number":
      return NUMBER_FILTER_OPERATORS;
    default:
      return STRING_FILTER_OPERATORS;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FilterFn = TanstackFilterFn<any, any>;

const getErrorMessage = (operator: string, filterType: string) =>
  `Unsupported operator "${operator}" for filter type "${filterType}"`;

export const stringFilterFn: FilterFn = (
  row,
  columnId,
  filterValue,
  addMeta,
) => {
  if (!filterValue) return true;

  const filterType: FilterType = "string";
  const res = validateValue(filterValue, stringFilterValueSchema);

  if (!res.success) {
    console.error(res.message);
    return false;
  }

  const { operator, value } = res.data;
  if (!value) return true;

  switch (operator) {
    case "contains":
      return filterFn_includesString(row, columnId, value, addMeta);
    case "not_contains":
      return !filterFn_includesString(row, columnId, value, addMeta);
    case "equals":
      return filterFn_equalsString(row, columnId, value, addMeta);
    case "not_equals":
      return !filterFn_equalsString(row, columnId, value, addMeta);
    case "starts_with":
      return filterFn_startsWith(row, columnId, value, addMeta);
    case "ends_with":
      return filterFn_endsWith(row, columnId, value, addMeta);
    case "is_empty":
      return filterFn_empty(row, columnId, value, addMeta);
    case "is_not_empty":
      return filterFn_notEmpty(row, columnId, value, addMeta);
    default: {
      console.error(getErrorMessage(operator, filterType));
      return false;
    }
  }
};

export const numberFilterFn: FilterFn = (
  row,
  columnId,
  filterValue,
  addMeta,
) => {
  if (!filterValue) return true;

  const filterType: FilterType = "number";
  const res = validateValue(filterValue, numberFilterValueSchema);

  if (!res.success) {
    console.error(res.message);
    return false;
  }

  const { operator, value } = res.data;
  if (!value || value.length === 0) return true;

  switch (operator) {
    case "equals":
      return filterFn_equals(row, columnId, value[0], addMeta);
    case "not_equals":
      return !filterFn_equals(row, columnId, value[0], addMeta);
    case "greater_than":
      return filterFn_greaterThan(row, columnId, value[0], addMeta);
    case "greater_than_or_equal_to":
      return filterFn_greaterThanOrEqualTo(row, columnId, value[0], addMeta);
    case "less_than":
      return !filterFn_greaterThanOrEqualTo(row, columnId, value[0], addMeta);
    case "less_than_or_equal_to":
      return !filterFn_greaterThan(row, columnId, value[0], addMeta);
    case "between":
      return filterFn_between(row, columnId, value, addMeta);
    case "between_inclusive":
      return filterFn_betweenInclusive(row, columnId, value, addMeta);
    case "not_between":
      return !filterFn_between(row, columnId, value, addMeta);
    case "not_between_inclusive":
      return !filterFn_betweenInclusive(row, columnId, value, addMeta);
    case "is_empty":
      return filterFn_empty(row, columnId, value, addMeta);
    case "is_not_empty":
      return filterFn_notEmpty(row, columnId, value, addMeta);
    default: {
      console.error(getErrorMessage(operator, filterType));
      return false;
    }
  }
};

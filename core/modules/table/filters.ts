import { validateValue } from "@/core/utils";
import {
  FilterFn as TanstackFilterFn,
  constructFilterFn,
  filterFn_arrHas,
  filterFn_arrIncludesAll,
  filterFn_arrIncludesSome,
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
import { z } from "zod";
import {
  BOOLEAN_FILTER_OPERATORS,
  NUMBER_FILTER_OPERATORS,
  OPTION_FILTER_OPERATORS,
  STRING_FILTER_OPERATORS,
} from "./operators";
import {
  booleanFilterValueSchema,
  filterValueSchema,
  multiOptionFilterValueSchema,
  numberFilterValueSchema,
  optionFilterValueSchema,
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
      value: [0],
    },
  },
  boolean: {
    popupType: "popover",
    defaultValue: {
      type: "boolean",
      operator: "is",
      value: true,
    },
  },
  option: {
    popupType: "menu",
    defaultValue: {
      type: "option",
      operator: "is_any_of",
      value: [],
    },
  },
  "multi-option": {
    popupType: "menu",
    defaultValue: {
      type: "multi-option",
      operator: "contains_any",
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
    case "boolean":
      return BOOLEAN_FILTER_OPERATORS;
    case "option":
      return OPTION_FILTER_OPERATORS;
    default:
      return STRING_FILTER_OPERATORS;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FilterFn = TanstackFilterFn<any, any>;

const getErrorMessage = (operator: string, filterType: string) =>
  `Unsupported operator "${operator}" for filter type "${filterType}"`;

export const stringFilterFn: FilterFn = (row, columnId, fv, addMeta) => {
  if (!fv) return true;

  const filterType: FilterType = "string";
  const filterValue = validateValue(fv, stringFilterValueSchema);

  if (!filterValue.success) {
    console.error(filterValue.message);
    return false;
  }

  const { operator, value } = filterValue.data;

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

export const numberFilterFn: FilterFn = (row, columnId, fv, addMeta) => {
  if (!fv) return true;

  const filterType: FilterType = "number";
  const filterValue = validateValue(fv, numberFilterValueSchema);

  if (!filterValue.success) {
    console.error(filterValue.message);
    return false;
  }

  const { operator, value } = filterValue.data;
  if (value.length === 0) return true;

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

export const booleanFilterFn: FilterFn = (row, columnId, fv, addMeta) => {
  if (!fv) return true;

  const filterType: FilterType = "boolean";
  const filterValue = validateValue(fv, booleanFilterValueSchema);

  if (!filterValue.success) {
    console.error(filterValue.message);
    return false;
  }

  const { operator, value } = filterValue.data;

  switch (operator) {
    case "is":
      return filterFn_equals(row, columnId, value, addMeta);
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

export const optionFilterFn: FilterFn = (row, columnId, fv, addMeta) => {
  if (!fv) return true;

  const filterType: FilterType = "option";
  const filterValue = validateValue(fv, optionFilterValueSchema);

  if (!filterValue.success) {
    console.error(filterValue.message);
    return false;
  }

  const { operator, value } = filterValue.data;

  switch (operator) {
    case "is_any_of":
      return filterFn_arrHas(row, columnId, value, addMeta);
    case "is_none_of":
      return !filterFn_arrHas(row, columnId, value, addMeta);
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

export const multiOptionFilterFn: FilterFn = (row, columnId, fv, addMeta) => {
  if (!fv) return true;

  const filterType: FilterType = "multi-option";
  const filterValue = validateValue(fv, multiOptionFilterValueSchema);

  if (!filterValue.success) {
    console.error(filterValue.message);
    return false;
  }

  const { operator, value } = filterValue.data;

  switch (operator) {
    case "contains_any":
      return filterFn_arrIncludesSome(row, columnId, value, addMeta);
    case "contains_all":
      return filterFn_arrIncludesAll(row, columnId, value, addMeta);
    case "contains_none":
      return !filterFn_arrIncludesSome(row, columnId, value, addMeta);
    case "exactly_matches":
      return filterFn_arrExactlyMatches(row, columnId, value, addMeta);
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

export const filterFn_arrExactlyMatches = constructFilterFn({
  filter: (dataValue, filterValue: Array<unknown>) => {
    if (!Array.isArray(dataValue)) return false;
    if (dataValue.length !== filterValue.length) return false;
    for (const value of filterValue)
      if (!dataValue.includes(value)) return false;
    return true;
  },
  autoRemove: (val) => !val?.length,
});

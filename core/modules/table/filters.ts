import { validateValue } from "@/core/utils";
import {
  FilterFn as TanstackFilterFn,
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
import {
  filterFn_arrExactlyMatches,
  filterFn_dateExactly,
  filterFn_dateIs,
} from "./filter-fns";
import {
  booleanFilterSchema,
  multiOptionFilterSchema,
  numberFilterSchema,
  optionFilterSchema,
  stringFilterSchema,
  temporalFilterSchema,
} from "./schema";
import { FilterType } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FilterFn = TanstackFilterFn<any, any>;

const getErrorMessage = (operator: string, filterType: string) =>
  `Unsupported operator "${operator}" for filter type "${filterType}"`;

export const stringFilterFn: FilterFn = (row, columnId, fv, addMeta) => {
  if (!fv) return true;

  const filterType: FilterType = "string";
  const filterResult = validateValue(fv, stringFilterSchema);

  if (!filterResult.success) {
    console.error(`FilterFn Error: ${filterResult.message}`);
    return false;
  }

  const { operator, value } = filterResult.data;

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
  const filterResult = validateValue(fv, numberFilterSchema);

  if (!filterResult.success) {
    console.error(`FilterFn Error: ${filterResult.message}`);
    return false;
  }

  const { operator, value } = filterResult.data;
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
  const filterResult = validateValue(fv, booleanFilterSchema);

  if (!filterResult.success) {
    console.error(`FilterFn Error: ${filterResult.message}`);
    return false;
  }

  const { operator, value } = filterResult.data;

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
  const filterResult = validateValue(fv, optionFilterSchema);

  if (!filterResult.success) {
    console.error(`FilterFn Error: ${filterResult.message}`);
    return false;
  }

  const { operator, value } = filterResult.data;

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
  const filterResult = validateValue(fv, multiOptionFilterSchema);

  if (!filterResult.success) {
    console.error(`FilterFn Error: ${filterResult.message}`);
    return false;
  }

  const { operator, value } = filterResult.data;

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

export const dateTimeFilterFn: FilterFn = (row, columnId, fv, addMeta) => {
  if (!fv) return true;

  const filterType: FilterType = "date-time";
  const filterResult = validateValue(fv, temporalFilterSchema);

  if (!filterResult.success) {
    console.error(`FilterFn Error: ${filterResult.message}`);
    return false;
  }

  const filter = filterResult.data;

  switch (filter.operator) {
    case "exactly":
      return filterFn_dateExactly(row, columnId, filter, addMeta);
    case "is":
      return filterFn_dateIs(row, columnId, filter, addMeta);
    case "is_not":
      return !filterFn_dateIs(row, columnId, filter, addMeta);
    // case "before":
    //   return filterFn_dateBefore(row, columnId, filter, addMeta);
    // case "after":
    //   return filterFn_dateAfter(row, columnId, filter, addMeta);
    // case "on_or_before":
    //   return filterFn_dateOnOrBefore(row, columnId, filter, addMeta);
    // case "on_or_after":
    //   return filterFn_dateOnOrAfter(row, columnId, filter, addMeta);
    // case "between":
    //   return filterFn_dateBetween(row, columnId, filter, addMeta);
    // case "not_between":
    //   return !filterFn_dateBetween(row, columnId, filter, addMeta);
    case "is_empty":
      return filterFn_empty(row, columnId, filter.value, addMeta);
    case "is_not_empty":
      return filterFn_notEmpty(row, columnId, filter.value, addMeta);
    default: {
      console.error(getErrorMessage(filter.operator, filterType));
      return false;
    }
  }
};

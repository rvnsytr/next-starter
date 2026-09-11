import { FilterType } from "./types";

export type StringFilterOperator =
  (typeof STRING_FILTER_OPERATORS)[number]["value"];

export type NumberFilterOperator =
  (typeof NUMBER_FILTER_OPERATORS)[number]["value"];

export type BooleanFilterOperator =
  (typeof BOOLEAN_FILTER_OPERATORS)[number]["value"];

export type OptionFilterOperator =
  (typeof OPTION_FILTER_OPERATORS)[number]["value"];

export type MultiOptionFilterOperator =
  (typeof MULTI_OPTION_FILTER_OPERATORS)[number]["value"];

export type TemporalFilterOperator =
  (typeof TEMPORAL_FILTER_OPERATORS)[number]["value"];

export type DateTimeFilterOperator =
  (typeof DATE_TIME_FILTER_OPERATORS)[number]["value"];

export type DateMultipleFilterOperator =
  (typeof DATE_MULTIPLE_FILTER_OPERATORS)[number]["value"];

// export type DateRangeFilterOperator =
//   (typeof DATE_RANGE_FILTER_OPERATORS)[number]["value"];

export const EMPTY_FILTER_OPERATORS = [
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
] as const;

export const STRING_FILTER_OPERATORS = [
  { value: "contains", label: "contains" },
  { value: "not_contains", label: "does not contain" },
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "starts_with", label: "starts with" },
  { value: "ends_with", label: "ends with" },
  ...EMPTY_FILTER_OPERATORS,
] as const;

export const NUMBER_FILTER_OPERATORS = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "greater_than", label: "greater than" },
  { value: "greater_than_or_equal_to", label: "greater than or equal to" },
  { value: "less_than", label: "less than" },
  { value: "less_than_or_equal_to", label: "less than or equal to" },
  { value: "between", label: "between" },
  { value: "between_inclusive", label: "between inclusive" },
  { value: "not_between", label: "not between" },
  { value: "not_between_inclusive", label: "not between inclusive" },
  ...EMPTY_FILTER_OPERATORS,
] as const;

export const BOOLEAN_FILTER_OPERATORS = [
  { value: "is", label: "is" },
  ...EMPTY_FILTER_OPERATORS,
] as const;

export const OPTION_FILTER_OPERATORS = [
  { value: "is_any_of", label: "is any of" },
  { value: "is_none_of", label: "is none of" },
  ...EMPTY_FILTER_OPERATORS,
] as const;

export const MULTI_OPTION_FILTER_OPERATORS = [
  { value: "contains_any", label: "contains any" },
  { value: "contains_all", label: "contains all" },
  { value: "contains_none", label: "contains none of" },
  { value: "exactly_matches", label: "exactly matches" },
  ...EMPTY_FILTER_OPERATORS,
] as const;

export const TEMPORAL_FILTER_OPERATORS = [
  { value: "is", label: "is" },
  { value: "is_not", label: "is not" },
  { value: "before", label: "before" },
  { value: "after", label: "after" },
  { value: "on_or_before", label: "on or before" },
  { value: "on_or_after", label: "on or after" },
  { value: "between", label: "between" },
  { value: "not_between", label: "not between" },
  ...EMPTY_FILTER_OPERATORS,
] as const;

export const DATE_TIME_FILTER_OPERATORS = [
  { value: "exactly", label: "exactly" },
  ...TEMPORAL_FILTER_OPERATORS,
] as const;

export const DATE_MULTIPLE_FILTER_OPERATORS = [
  { value: "contains", label: "contains date" },
  { value: "not_contains", label: "does not contain date" },
  { value: "contains_any", label: "contains any" },
  { value: "contains_all", label: "contains all" },
  { value: "exactly_equals", label: "exactly matches" },
  ...EMPTY_FILTER_OPERATORS,
] as const;

// export const DATE_RANGE_FILTER_OPERATORS = [
//   { value: "is_within", label: "is within" },
//   { value: "overlaps", label: "overlaps" },
//   { value: "contains", label: "contains" },
//   { value: "starts_before", label: "starts before" },
//   { value: "ends_after", label: "ends after" },
// ] as const;

export const STRING_FILTER_OPERATOR_VALUES = STRING_FILTER_OPERATORS.map(
  (op) => op.value,
);

export const NUMBER_FILTER_OPERATOR_VALUES = NUMBER_FILTER_OPERATORS.map(
  (op) => op.value,
);

export const BOOLEAN_FILTER_OPERATOR_VALUES = BOOLEAN_FILTER_OPERATORS.map(
  (op) => op.value,
);

export const OPTION_FILTER_OPERATOR_VALUES = OPTION_FILTER_OPERATORS.map(
  (op) => op.value,
);

export const MULTI_OPTION_FILTER_OPERATOR_VALUES =
  MULTI_OPTION_FILTER_OPERATORS.map((op) => op.value);

export const TEMPORAL_FILTER_OPERATOR_VALUES = TEMPORAL_FILTER_OPERATORS.map(
  (op) => op.value,
);

export const DATE_TIME_FILTER_OPERATOR_VALUES = DATE_TIME_FILTER_OPERATORS.map(
  (op) => op.value,
);

export const DATE_MULTIPLE_FILTER_OPERATOR_VALUES =
  DATE_MULTIPLE_FILTER_OPERATORS.map((op) => op.value);

// export const DATE_RANGE_FILTER_OPERATOR_VALUES =
//   DATE_RANGE_FILTER_OPERATORS.map((op) => op.value);

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
    case "multi-option":
      return MULTI_OPTION_FILTER_OPERATORS;
    case "date-time":
      return DATE_TIME_FILTER_OPERATORS;
    case "date":
    case "time":
      return TEMPORAL_FILTER_OPERATORS;
    default:
      return STRING_FILTER_OPERATORS;
  }
}

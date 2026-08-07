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

export type DateTimeFilterOperator =
  (typeof DATE_TIME_FILTER_OPERATORS)[number]["value"];

export type DateMultipleFilterOperator =
  (typeof DATE_MULTIPLE_FILTER_OPERATORS)[number]["value"];

export type DateRangeFilterOperator =
  (typeof DATE_RANGE_FILTER_OPERATORS)[number]["value"];

export const STRING_FILTER_OPERATORS = [
  { value: "contains", label: "contains" },
  { value: "not_contains", label: "does not contain" },
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "starts_with", label: "starts with" },
  { value: "ends_with", label: "ends with" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
] as const;

export const NUMBER_FILTER_OPERATORS = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "greater_than", label: "greater than" },
  { value: "greater_than_or_equal", label: "greater than or equal" },
  { value: "less_than", label: "less than" },
  { value: "less_than_or_equal", label: "less than or equal" },
  { value: "between", label: "between" },
  { value: "not_between", label: "not between" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
] as const;

export const BOOLEAN_FILTER_OPERATORS = [
  { value: "is", label: "is" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
] as const;

export const OPTION_FILTER_OPERATORS = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
] as const;

export const MULTI_OPTION_FILTER_OPERATORS = [
  { value: "contains", label: "contains" },
  { value: "not_contains", label: "does not contain" },
  { value: "contains_any", label: "contains any" },
  { value: "contains_all", label: "contains all" },
  { value: "exactly_equals", label: "exactly matches" },
  { value: "is_empty", label: "is empty" },
] as const;

export const DATE_TIME_FILTER_OPERATORS = [
  { value: "is", label: "is" },
  { value: "is_not", label: "is not" },
  { value: "before", label: "before" },
  { value: "after", label: "after" },
  { value: "on_or_before", label: "on or before" },
  { value: "on_or_after", label: "on or after" },
  { value: "between", label: "between" },
  { value: "not_between", label: "not between" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
] as const;

export const DATE_MULTIPLE_FILTER_OPERATORS = [
  { value: "contains", label: "contains date" },
  { value: "not_contains", label: "does not contain date" },
  { value: "contains_any", label: "contains any" },
  { value: "contains_all", label: "contains all" },
  { value: "exactly_equals", label: "exactly matches" },
  { value: "is_empty", label: "is empty" },
] as const;

export const DATE_RANGE_FILTER_OPERATORS = [
  { value: "is_within", label: "is within" },
  { value: "overlaps", label: "overlaps" },
  { value: "contains", label: "contains" },
  { value: "starts_before", label: "starts before" },
  { value: "ends_after", label: "ends after" },
] as const;

export const STRING_FILTER_OPERATOR_VALUES = STRING_FILTER_OPERATORS.map(
  (operator) => operator.value,
) as StringFilterOperator[];

export const NUMBER_FILTER_OPERATOR_VALUES = NUMBER_FILTER_OPERATORS.map(
  (operator) => operator.value,
) as NumberFilterOperator[];

export const BOOLEAN_FILTER_OPERATOR_VALUES = BOOLEAN_FILTER_OPERATORS.map(
  (operator) => operator.value,
) as BooleanFilterOperator[];

export const OPTION_FILTER_OPERATOR_VALUES = OPTION_FILTER_OPERATORS.map(
  (operator) => operator.value,
) as OptionFilterOperator[];

export const MULTI_OPTION_FILTER_OPERATOR_VALUES =
  MULTI_OPTION_FILTER_OPERATORS.map(
    (operator) => operator.value,
  ) as MultiOptionFilterOperator[];

export const DATE_TIME_FILTER_OPERATOR_VALUES = DATE_TIME_FILTER_OPERATORS.map(
  (operator) => operator.value,
) as DateTimeFilterOperator[];

export const DATE_MULTIPLE_FILTER_OPERATOR_VALUES =
  DATE_MULTIPLE_FILTER_OPERATORS.map(
    (operator) => operator.value,
  ) as DateMultipleFilterOperator[];

export const DATE_RANGE_FILTER_OPERATOR_VALUES =
  DATE_RANGE_FILTER_OPERATORS.map(
    (operator) => operator.value,
  ) as DateRangeFilterOperator[];

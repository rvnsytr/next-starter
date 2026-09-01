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

const emptyFilterOperators = [
  {
    value: "is_empty",
    label: "is empty",
    withValue: false,
  },
  {
    value: "is_not_empty",
    label: "is not empty",
    withValue: false,
  },
] as const;

export const STRING_FILTER_OPERATORS = [
  {
    value: "contains",
    label: "contains",
    withValue: true,
  },
  {
    value: "not_contains",
    label: "does not contain",
    withValue: true,
  },
  {
    value: "equals",
    label: "equals",
    withValue: true,
  },
  {
    value: "not_equals",
    label: "does not equal",
    withValue: true,
  },
  {
    value: "starts_with",
    label: "starts with",
    withValue: true,
  },
  {
    value: "ends_with",
    label: "ends with",
    withValue: true,
  },
  ...emptyFilterOperators,
] as const;

export const NUMBER_FILTER_OPERATORS = [
  {
    value: "equals",
    label: "equals",
    withValue: true,
  },
  {
    value: "not_equals",
    label: "does not equal",
    withValue: true,
  },
  {
    value: "greater_than",
    label: "greater than",
    withValue: true,
  },
  {
    value: "greater_than_or_equal_to",
    label: "greater than or equal to",
    withValue: true,
  },
  {
    value: "less_than",
    label: "less than",
    withValue: true,
  },
  {
    value: "less_than_or_equal_to",
    label: "less than or equal to",
    withValue: true,
  },
  {
    value: "between",
    label: "between",
    withValue: true,
  },
  {
    value: "between_inclusive",
    label: "between inclusive",
    withValue: true,
  },
  {
    value: "not_between",
    label: "not between",
    withValue: true,
  },
  {
    value: "not_between_inclusive",
    label: "not between inclusive",
    withValue: true,
  },
  ...emptyFilterOperators,
] as const;

export const BOOLEAN_FILTER_OPERATORS = [
  {
    value: "is",
    label: "is",
    withValue: true,
  },
  ...emptyFilterOperators,
] as const;

export const OPTION_FILTER_OPERATORS = [
  {
    value: "is_any_of",
    label: "is any of",
    withValue: true,
  },
  {
    value: "is_none_of",
    label: "is none of",
    withValue: true,
  },
  ...emptyFilterOperators,
] as const;

export const MULTI_OPTION_FILTER_OPERATORS = [
  {
    value: "contains_any",
    label: "contains any",
    withValue: true,
  },
  {
    value: "contains_all",
    label: "contains all",
    withValue: true,
  },
  {
    value: "contains_none",
    label: "contains none of",
    withValue: true,
  },
  {
    value: "exactly_matches",
    label: "exactly matches",
    withValue: true,
  },
  ...emptyFilterOperators,
] as const;

export const DATE_TIME_FILTER_OPERATORS = [
  {
    value: "is",
    label: "is",
    withValue: true,
  },
  {
    value: "is_not",
    label: "is not",
    withValue: true,
  },
  {
    value: "before",
    label: "before",
    withValue: true,
  },
  {
    value: "after",
    label: "after",
    withValue: true,
  },
  {
    value: "on_or_before",
    label: "on or before",
    withValue: true,
  },
  {
    value: "on_or_after",
    label: "on or after",
    withValue: true,
  },
  {
    value: "between",
    label: "between",
    withValue: true,
  },
  {
    value: "not_between",
    label: "not between",
    withValue: true,
  },
  ...emptyFilterOperators,
] as const;

export const DATE_MULTIPLE_FILTER_OPERATORS = [
  {
    value: "contains",
    label: "contains date",
    withValue: true,
  },
  {
    value: "not_contains",
    label: "does not contain date",
    withValue: true,
  },
  {
    value: "contains_any",
    label: "contains any",
    withValue: true,
  },
  {
    value: "contains_all",
    label: "contains all",
    withValue: true,
  },
  {
    value: "exactly_equals",
    label: "exactly matches",
    withValue: true,
  },
  ...emptyFilterOperators,
] as const;

export const DATE_RANGE_FILTER_OPERATORS = [
  {
    value: "is_within",
    label: "is within",
    withValue: true,
  },
  {
    value: "overlaps",
    label: "overlaps",
    withValue: true,
  },
  {
    value: "contains",
    label: "contains",
    withValue: true,
  },
  {
    value: "starts_before",
    label: "starts before",
    withValue: true,
  },
  {
    value: "ends_after",
    label: "ends after",
    withValue: true,
  },
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

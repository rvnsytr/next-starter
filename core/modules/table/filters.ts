import { validateValue } from "@/core/utils";
import {
  FilterFn as TanstackFilterFn,
  filterFn_empty,
  filterFn_endsWith,
  filterFn_equalsString,
  filterFn_includesString,
  filterFn_notEmpty,
  filterFn_startsWith,
} from "@tanstack/react-table";
import { z } from "better-auth";
import { filterValueSchema, stringFilterValueSchema } from "./schema";

export type FilterValue = z.infer<typeof filterValueSchema>;
export type FilterPopupType = "menu" | "popover";

export type FilterMeta = {
  [T in FilterValue["type"]]: {
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
};

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

  const filterType: FilterValue["type"] = "string";
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

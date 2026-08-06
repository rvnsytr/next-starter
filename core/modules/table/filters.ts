import { FilterFn, filterFn_includesString } from "@tanstack/react-table";
import { z } from "better-auth";
import { filterValueSchema } from "./schema";
import { validateFilterValue } from "./utils";

export type FilterValue = z.infer<typeof filterValueSchema>;
export type FilterPopupType = "menu" | "popover";

export type FilterType = FilterValue["type"];

export type FilterMeta = {
  [T in FilterType]: {
    popupType: FilterPopupType;
    defaultValue: Extract<FilterValue, { type: T }>;
  };
};

export const filterMeta: FilterMeta = {
  string: {
    popupType: "popover",
    defaultValue: { type: "string", value: "" },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterFns: Record<FilterType, FilterFn<any, any>> = {
  string: (row, columnId, filterValue, addMeta) => {
    if (!filterValue)
      return filterFn_includesString(row, columnId, filterValue, addMeta);

    const res = validateFilterValue("string", columnId, filterValue);

    if (!res.success) {
      console.error(res.message);
      return false;
    }

    const { value } = res.data;

    return filterFn_includesString(row, columnId, value, addMeta);
  },
};

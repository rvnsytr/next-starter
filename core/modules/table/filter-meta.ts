import { Filter, FilterPopupType, FilterType } from "./types";

export type FilterMeta<T extends FilterType> = {
  popupType: FilterPopupType;
  defaultValue: Extract<Filter, { type: T }>;
};

export const filterMeta: {
  [T in FilterType]: FilterMeta<T>;
} = {
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
  temporal: {
    popupType: "popover",
    defaultValue: {
      type: "temporal",
      operator: "is",
      value: [new Date()],
    },
  },
};

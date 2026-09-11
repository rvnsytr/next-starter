import { z } from "zod";
import { filterSchema } from "../schema";
import { ColumnMeta } from "./meta";

export type Filter = z.infer<typeof filterSchema>;
export type FilterType = Filter["type"];

export type FilterPopupType = "menu" | "popover";

export type ColumnFilterContext = {
  columnId: string;
  filter: Filter;
  setFilter: (updater: Filter | undefined) => void;
  popupType: FilterPopupType;
  columnMeta?: ColumnMeta;
};

export type ColumnFilterError = {
  id: string;
  type: "column" | "validation";
  message?: string;
  error?: unknown;
};

export type ColumnFilterResult =
  | ({ success: true } & ColumnFilterContext)
  | ({ success: false } & ColumnFilterError);

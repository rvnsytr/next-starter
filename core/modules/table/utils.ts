import { ActionResponse } from "@/core/types";
import { formatZodError } from "@/core/utils";
import { FilterType, FilterValue } from "./filters";
import { dataTable } from "./hooks/data-table";
import { STRING_FILTER_OPERATORS } from "./operators";
import { filterValueSchema } from "./schema";
import { DataTableType } from "./types";

export function getTableHook(tableType: DataTableType) {
  switch (tableType) {
    case "data-table-server":
      return dataTable;
    default:
      return dataTable;
  }
}

export function getFilterOperators(filterType: FilterType) {
  switch (filterType) {
    case "string":
      return STRING_FILTER_OPERATORS;
    default:
      return STRING_FILTER_OPERATORS;
  }
}

export function validateFilterValue(
  filterType: FilterType,
  columnId: string,
  filterValue: unknown,
): ActionResponse<FilterValue> {
  const success = false;
  const res = filterValueSchema.safeParse(filterValue);

  if (!res.success) {
    const error = formatZodError(res.error);
    return { success, message: error.message, error };
  }

  if (res.data.type !== filterType) {
    const message = `Invalid filter type: expected "${filterType}", got "${res.data.type}" on column "${columnId}"`;
    return { success, message };
  }

  return { success: true, data: res.data };
}

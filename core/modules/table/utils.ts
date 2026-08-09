import { FilterValue } from "./filters";
import { dataTable } from "./hooks/data-table";
import { STRING_FILTER_OPERATORS } from "./operators";
import { TableType } from "./types";

export function getTableHook(tableType: TableType) {
  switch (tableType) {
    default:
      return dataTable;
  }
}

export function getFilterOperators(filterType: FilterValue["type"]) {
  switch (filterType) {
    case "string":
      return STRING_FILTER_OPERATORS;
    default:
      return STRING_FILTER_OPERATORS;
  }
}

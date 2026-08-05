import { dataTable } from "./hooks/data-table";
import { DataTableType } from "./types";

export function getTableHook(tableType: DataTableType) {
  switch (tableType) {
    case "data-table-server":
      return dataTable;

    default:
      return dataTable;
  }
}

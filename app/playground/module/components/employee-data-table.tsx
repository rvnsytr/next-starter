"use client";

import { dataTable } from "@/core/modules/data-table/table-hook";
import { employees } from "../data";
import { employeeColumns } from "./employee-columns";

export function EmployeeDataTable() {
  const table = dataTable.useAppTable({
    columns: employeeColumns,
    data: employees,
    getRowId: (row) => row.id.toString(),
  });

  return (
    <table.AppTable>
      <div className="container">
        <table.CellVisibilityDropdown align="start" shortcut="default" />
      </div>
      <table.DataTable />
    </table.AppTable>
  );
}

"use client";

import { coreTable } from "@/core/modules/data-table/hooks/core-table";
import { employees } from "../data";
import { employeeColumns } from "./employee-columns";

export function EmployeeCoreTable() {
  const table = coreTable.useAppTable({
    columns: employeeColumns,
    data: employees,
    getRowId: (row) => row.id.toString(),
  });

  return (
    <table.AppTable>
      <div className="container">
        <table.ColumnVisibilityMenu align="start" shortcut="default" />
      </div>
      <table.Table />
    </table.AppTable>
  );
}

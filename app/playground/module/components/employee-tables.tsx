"use client";

import { dataTable } from "@/core/modules/table/hooks/data-table";
import { extremeEmployees } from "../data";
import { employeeColumns } from "./employee-columns";

export function EmployeeDataTable() {
  const table = dataTable.useAppTable({
    columns: employeeColumns,
    data: extremeEmployees,
    getRowId: (row) => row.id.toString(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
  });

  return (
    <table.AppTable>
      <table.Template
        tableProps={{
          variant: "bordered",
          containerProps: {
            className: "rounded-none border-x-0",
          },
        }}
      />
    </table.AppTable>
  );
}

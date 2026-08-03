"use client";

import { dataTable } from "@/core/modules/table/hooks/data-table";
import { extremeEmployees } from "../data";
import { employeeColumns } from "./employee-columns";

export function EmployeeDataTable() {
  const table = dataTable.useAppTable({
    columns: employeeColumns,
    data: extremeEmployees,
    getRowId: (row) => row.id.toString(),
  });

  return (
    <table.AppTable>
      <div className="container flex gap-x-2">
        <table.ColumnVisibilityMenu align="start" shortcut="default" />
        <table.ColumnSortMenu shortcut="default" />
        <table.ResetTableButton shortcut="default" />
        <table.Pagination />
        <table.PageSize />
        <table.Search shortcut="default" />
      </div>
      <table.Table
        variant="bordered"
        containerClassName="rounded-none border-x-0"
      />
    </table.AppTable>
  );
}

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
      <div className="container flex gap-x-2">
        <table.ColumnVisibilityMenu shortcut="default" />
        <table.ColumnSortMenu shortcut="default" />
        <table.Reset shortcut="default" />
        <table.Pagination />
        <table.PageSizeSelector />
        <table.Search shortcut="default" />
      </div>
      <table.Table
        variant="bordered"
        containerClassName=" rounded-none border-x-0"
      />
    </table.AppTable>
  );
}

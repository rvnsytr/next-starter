"use client";

import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import useSWR from "swr";
import { getEmployees } from "../actions";
import { employeeDGColumns } from "./employee-dg-columns";
import { employeeDTColumns } from "./employee-dt-columns";

export function EmployeeDataTable() {
  const { data, isLoading } = useSWR(
    "/employees",
    async () => await getEmployees(10),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const table = dataTable.useAppTable({
    data: data ?? [],
    columns: employeeDTColumns,
    getRowId: (row) => row.id.toString(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
  });

  return (
    <table.AppTable>
      <table.Layout
        tableProps={{
          variant: "bordered",
          containerProps: {
            className: "rounded-none border-x-0",
          },
          loading: isLoading,
        }}
        resetTableButtonProps={{ shortcut: ["R", "1"] }}
      />
    </table.AppTable>
  );
}

export function EmployeeDataGrid() {
  const { data, isLoading } = useSWR(
    "/employees",
    async () => await getEmployees(10),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const table = dataGrid.useAppTable({
    data: data ?? [],
    columns: employeeDGColumns,
    getRowId: (row) => row.id.toString(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
  });

  return (
    <table.AppTable>
      <table.Layout
        tableProps={{
          // containerProps: {
          //   className: "rounded-none border-x-0",
          // },
          loading: isLoading,
        }}
      />
    </table.AppTable>
  );
}

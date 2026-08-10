"use client";

import { dataTable } from "@/core/modules/table/hooks/data-table";
import useSWR from "swr";
import { getEmployees } from "../actions";
import { employeeDTColumns } from "./employee-dt-columns";

export function EmployeeDataTable() {
  const { data, isLoading } = useSWR(
    "/employees",
    async () => await getEmployees(100000),
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
      />
    </table.AppTable>
  );
}

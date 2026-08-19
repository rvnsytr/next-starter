"use client";

import { toast } from "@/core/components/ui/toast";
import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { LoadingFallback } from "@/shared/components/fallback";
import useSWR from "swr";
import { getEmployees } from "../actions";
import { employeeDGColumns } from "./employee-dg-columns";
import { employeeDTColumns } from "./employee-dt-columns";

export function EmployeeDataTable() {
  const isMounted = useIsMounted();

  const { data, isLoading } = useSWR(
    "/dt/employees",
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
  });

  if (!isMounted) return <LoadingFallback variant="frame" />;

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
        columnSortMenuProps={{ shortcut: ["S", "1"] }}
        columnVisibilityMenuProps={{ shortcut: ["V", "1"] }}
        filterSelectorProps={{ shortcut: ["F", "1"] }}
        resetTableButtonProps={{ shortcut: ["R", "1"] }}
        searchProps={{ shortcut: ["Control+/", "1"] }}
      />
    </table.AppTable>
  );
}

export function EmployeeDataGrid() {
  const isMounted = useIsMounted();

  const { data, isLoading } = useSWR(
    "/dg/employees",
    async () => await getEmployees(20),
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
    meta: {
      onSave: (ctx) => {
        toast.add({
          description: (
            <span className="whitespace-pre-wrap">
              {JSON.stringify(ctx, null, 2)}
            </span>
          ),
        });
      },
    },
  });

  if (!isMounted) return <LoadingFallback variant="frame" />;

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

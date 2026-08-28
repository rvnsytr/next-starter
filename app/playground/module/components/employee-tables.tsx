"use client";

import { toast } from "@/core/components/ui/toast";
import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { mergeNested } from "@/core/modules/table/utils";
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
      />
    </table.AppTable>
  );
}

export function EmployeeDataGrid() {
  const isMounted = useIsMounted();

  const { data, mutate, isLoading } = useSWR(
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
      defaultValues: {
        id: crypto.randomUUID(),
        name: "",
        email: "",
        age: 0,
        salary: 0,
        createdAt: new Date(),
        status: "active",
        role: "Support",
        skills: [],
        department: "",
        manager: "",
        phone: "",
        address: {
          city: "",
          country: "",
        },
        projects: [],
      },

      onSave: (ctx) => {
        mutate(
          (prev) => {
            if (!prev) return prev;
            let newData = prev;

            ctx.removed?.forEach((c) => {
              newData = newData.filter((r) => r.id !== c.rowData.id);
            });

            ctx.added?.forEach((r) => newData.unshift(r));

            ctx.updated.forEach((c) => {
              const rowIndex = newData.findIndex((r) => r.id === c.rowId);
              if (rowIndex >= 0)
                newData[rowIndex] = mergeNested(newData[rowIndex], c.changes);
            });

            return newData;
          },
          { revalidate: false },
        );

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

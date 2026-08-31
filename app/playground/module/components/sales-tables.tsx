"use client";

import { toast } from "@/core/components/ui/toast";
import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { mergeNested } from "@/core/modules/table/utils";
import { LoadingFallback } from "@/shared/components/fallback";
import useSWR from "swr";
import { getSales } from "../actions";
import { saleDGColumns } from "./sales-dg-columns";
import { saleDTColumns } from "./sales-dt-columns";

export function SaleDataTable() {
  const isMounted = useIsMounted();

  const { data, isLoading } = useSWR(
    "/dt/sales",
    async () => await getSales(10),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const table = dataTable.useAppTable({
    data: data ?? [],
    columns: saleDTColumns,
    getRowId: (row) => row.id.toString(),
    meta: { loading: isLoading },
  });

  if (!isMounted) return <LoadingFallback variant="frame" />;

  return (
    <table.AppTable>
      <table.Layout>
        <table.Table
          variant="bordered"
          containerProps={{ className: "rounded-none border-x-0" }}
        />
      </table.Layout>
    </table.AppTable>
  );
}

export function SaleDataGrid() {
  const isMounted = useIsMounted();

  const { data, mutate, isLoading } = useSWR(
    "/dg/sales",
    async () => await getSales(20),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const table = dataGrid.useAppTable({
    data: data ?? [],
    columns: saleDGColumns,
    getRowId: (row) => row.id,
    meta: {
      loading: isLoading,

      defaultValues: {
        id: crypto.randomUUID(),
        customerName: "",
        customerEmail: "",
        salesRep: "",
        notes: "",
        amount: 0,
        isPaid: false,
        purchasedAt: new Date(),
        status: "Pending",
        products: [],
        shippingAddress: {
          city: "",
          country: "",
        },
        deliveryPeriod: {
          from: new Date(),
          to: new Date(),
        },
        availableDates: [],
        preferredTime: "",
        deliveryTimes: [],
      },

      onSave: (ctx) => {
        mutate(
          (prev) => {
            if (!prev) return prev;
            let newData = prev;

            ctx.added?.forEach((r) => newData.unshift(r));

            ctx.updated.forEach((c) => {
              const rowIndex = newData.findIndex((r) => r.id === c.rowId);
              if (rowIndex >= 0)
                newData[rowIndex] = mergeNested(newData[rowIndex], c.changes);
            });

            ctx.removed?.forEach((c) => {
              newData = newData.filter((r) => r.id !== c.rowData.id);
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

        return true;
      },
    },
  });

  if (!isMounted) return <LoadingFallback variant="frame" />;

  return (
    <table.AppTable>
      <table.Layout>
        <table.Table
          variant="bordered"
          containerProps={{ className: "rounded-none border-x-0" }}
        />
      </table.Layout>
    </table.AppTable>
  );
}

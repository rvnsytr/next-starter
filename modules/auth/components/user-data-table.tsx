"use client";

import {
  DataControllerPageSize,
  DataControllerPaginationNav,
  DataControllerSearch,
  DataControllerVisibility,
} from "@/core/components/data-controller";
import { Separator } from "@/core/components/ui/separator";
import { useDataController } from "@/core/hooks/use-data-controller";
import { listUsers } from "../actions";
import { getUserColumns } from "./user-column";

export function UserDataTable() {
  const { table } = useDataController({
    mode: "auto",
    columns: () => getUserColumns(),
    query: {
      key: "/auth/admin/list-users",
      fetcher: async () => await listUsers(),
      immutable: true,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <DataControllerVisibility table={table} />
        <DataControllerPaginationNav table={table} />
        <DataControllerPageSize table={table} />
        <DataControllerSearch table={table} />
      </div>

      <pre>{JSON.stringify(table.getRowModel().rows.length, null, 2)}</pre>
      <Separator />
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
    </div>
  );
}

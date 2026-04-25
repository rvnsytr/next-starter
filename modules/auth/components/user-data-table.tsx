"use client";

import { DataControllerSearch } from "@/core/components/data-controller";
import { Separator } from "@/core/components/ui/separator";
import { useDataController } from "@/core/hooks/use-data-controller";
import { listUsers } from "../actions";
import { getUserColumns } from "./user-column";

export function UserDataTable() {
  const { result, state, table } = useDataController({
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
      <DataControllerSearch table={table} />
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <Separator />
      <pre>
        {JSON.stringify(
          {
            isValidating: result.isValidating,
            isLoading: result.isLoading,
            tableData: table.getRowModel().rows.length,
            data: result.data,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}

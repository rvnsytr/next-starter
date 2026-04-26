"use client";

import { DataTable } from "@/core/components/data-table";
import { listUsers } from "../actions";
import { getUserColumns } from "./user-column";

const key = "/auth/admin/list-users";
export const mutateUserDataTable = () => mutateControlledData(key);

export function UserDataTable() {
  return (
    <DataTable
      mode="auto"
      columns={(res) => getUserColumns(res)}
      query={{
        key: "/auth/admin/list-users",
        fetcher: async () => await listUsers(),
        immutable: true,
      }}
    />
  );
}

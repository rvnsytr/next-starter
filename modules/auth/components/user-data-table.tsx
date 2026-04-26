"use client";

import { AuthSession } from "@/core/auth";
import { DataTable } from "@/core/components/data-table";
import { mutateControlledData } from "@/core/hooks/use-data-controller";
import { useState } from "react";
import { listUsers } from "../actions";
import { getUserColumns } from "./user-column";
import { UserDetailDialog } from "./user-detail-dialog";

const key = "/auth/admin/list-users";
export const mutateUserDataTable = () => mutateControlledData(key);

export function UserDataTable() {
  const [data, setData] = useState<AuthSession["user"] | null>(null);

  return (
    <>
      <DataTable
        mode="auto"
        columns={(res) => getUserColumns(setData, res)}
        query={{ key, fetcher: async () => await listUsers(), immutable: true }}
      />

      <UserDetailDialog data={data} setData={setData} />
    </>
  );
}

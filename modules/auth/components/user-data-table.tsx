"use client";

import { AuthSession } from "@/core/auth";
import { QueryDataTable } from "@/core/components/data-table";
import { Button } from "@/core/components/ui/button";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/core/components/ui/menu";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { mutateControlledData } from "@/core/hooks/use-data-controller";
import { messages } from "@/core/messages";
import { BanIcon, MonitorOff, Settings2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { listUsers } from "../actions";
import { useSession } from "../provider";
import { ActionDeleteUsersDialog } from "./delete-user-dialog";
import { ActionRevokeUserSessionsDialog } from "./revoke-user-sessions-dialog";
import { getUserColumns } from "./user-columns";
import { UserDetailDialog } from "./user-detail-dialog";

const key = "/auth/admin/list-users";
export const mutateUserDataTable = () => mutateControlledData(key);

export function UserDataTable() {
  const { user } = useSession();

  const [data, setData] = useState<AuthSession["user"] | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const [isRevokeSessionsDialogOpen, setIsRevokeSessionsDialogOpen] =
    useState<boolean>(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <QueryDataTable
        mode="auto"
        columns={(ctx) => {
          const isLoading = ctx?.isLoading ?? false;
          const count = ctx?.data?.count;
          return getUserColumns(setData, { isLoading, count });
        }}
        query={{
          key,
          fetcher: async () => await listUsers(user.role),
          immutable: true,
        }}
        getRowId={(row) => row.id}
        enableRowSelection={(row) => row.original.id !== user.id}
        placeholder={{ search: "Cari Pengguna..." }}
        shortcuts={{
          filter: "F",
          sort: "S",
          view: "V",
          reset: "R",
          search: "/",
        }}
        renderRowSelectionButton={({ table, rows }) => {
          const data = rows.map((row) => row.original);
          return (
            <>
              <Menu>
                <MenuTrigger
                  render={
                    <Button variant="outline" disabled={isActionLoading}>
                      <LoadingSpinner
                        icon={{ base: <Settings2Icon /> }}
                        loading={isActionLoading}
                      />
                      {messages.actions.action}
                    </Button>
                  }
                />

                <MenuPopup>
                  <MenuGroup>
                    <MenuGroupLabel className="text-center">
                      Akun dipilih: <b>{data.length}</b>
                    </MenuGroupLabel>

                    <MenuSeparator />

                    <MenuItem
                      onClick={() => setIsRevokeSessionsDialogOpen(true)}
                    >
                      <MonitorOff /> Akhiri Sesi
                    </MenuItem>

                    <MenuSeparator />

                    {/* // TODO */}
                    <MenuItem variant="destructive" disabled>
                      <BanIcon /> Blokir
                    </MenuItem>

                    <MenuItem
                      variant="destructive"
                      onClick={() => setIsDeleteUserDialogOpen(true)}
                    >
                      <Trash2Icon /> Hapus
                    </MenuItem>
                  </MenuGroup>
                </MenuPopup>
              </Menu>

              <ActionRevokeUserSessionsDialog
                userIds={data.map(({ id }) => id)}
                open={isRevokeSessionsDialogOpen}
                setOpen={setIsRevokeSessionsDialogOpen}
                setIsLoading={setIsActionLoading}
                onSuccess={() => {
                  setIsRevokeSessionsDialogOpen(false);
                  table.resetRowSelection();
                  mutateUserDataTable();
                }}
              />

              <ActionDeleteUsersDialog
                userIds={data.map(({ id }) => id)}
                open={isDeleteUserDialogOpen}
                loading={isActionLoading}
                setOpen={setIsDeleteUserDialogOpen}
                setIsLoading={setIsActionLoading}
                onSuccess={() => {
                  table.resetRowSelection();
                  mutateUserDataTable();
                }}
              />
            </>
          );
        }}
      />

      <UserDetailDialog data={data} setData={setData} />
    </>
  );
}

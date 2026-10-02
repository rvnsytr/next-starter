"use client";

import { User } from "@/core/auth";
import { Button } from "@/core/components/ui/button";
import { toast } from "@/core/components/ui/toast";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { applyDataGridChanges } from "@/core/modules/table/utils";
import { delay } from "@/core/utils";
import { useMemo, useState } from "react";
import { useListUsers } from "../hooks/use-list-users";
import { useSession } from "../hooks/use-session";
import { getUserColumns } from "./user-columns";
import { UserDetailDialog } from "./user-detail-dialog";

/**
export const mutateUserDataTable = () =>
  mutateControlledData(authKeys.actions.users);

export function UserDataTable() {
  const { user } = useSession();

  const [data, setData] = useState<User | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const [isRevokeSessionsDialogOpen, setIsRevokeSessionsDialogOpen] =
    useState<boolean>(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <QueryDataTable
        mode="auto"
        columns={getUserColumns}
        query={{
          key: authKeys.actions.users,
          fetcher: async () => await listUsersAction(user.role),
          immutable: true,
        }}
        getRowId={(row) => row.id}
        enableRowSelection={(row) => row.original.id !== user.id}
        placeholder={{ search: "Search users..." }}
        shortcuts={{
          filter: "default",
          sort: "default",
          view: "default",
          reset: "default",
          search: "default",
        }}
        fullwidth="always"
        onRowClick={(row) => setData(row.original)}
        renderRowSelectionButton={({ table, rows }) => {
          const rowData = rows.map((row) => row.original);
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
                      Selected accounts: <b>{rowData.length}</b>
                    </MenuGroupLabel>

                    <MenuSeparator />

                    <MenuItem
                      onClick={() => setIsRevokeSessionsDialogOpen(true)}
                    >
                      <MonitorOff /> End sessions
                    </MenuItem>

                    <MenuSeparator />

                    <MenuItem variant="destructive" disabled>
                      <BanIcon /> Ban
                    </MenuItem>

                    <MenuItem
                      variant="destructive"
                      onClick={() => setIsDeleteUserDialogOpen(true)}
                    >
                      <Trash2Icon /> Delete
                    </MenuItem>
                  </MenuGroup>
                </MenuPopup>
              </Menu>

              <ActionRevokeUserSessionsDialog
                userIds={rowData.map(({ id }) => id)}
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
                userIds={rowData.map(({ id }) => id)}
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
*/

export function UsersDataGrid() {
  const { user } = useSession();

  const [detailData, setDetailData] = useState<User | null>(null);

  const {
    data = [],
    isLoading,
    mutate,
  } = useListUsers(user.role, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const columns = useMemo(
    () => getUserColumns({ onDetailClick: setDetailData }),
    [],
  );

  const table = dataGrid.useAppTable({
    data,
    columns,
    getRowId: (row) => row.id,
    meta: {
      loading: isLoading,

      defaultValues: {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        email: "",
        emailVerified: false,
        name: "",
        image: null,
        banExpires: null,
        banReason: null,
        banned: false,
        role: "user",
      },

      enableCellEditForRow: (row) => row.id !== user.id,

      onSave: async (ctx) => {
        ctx.clearEdit();
        toast.add({ type: "success", title: "Changes saved successfully" });

        await mutate(
          async (prev) => {
            await delay(1);
            toast.add({ type: "error", title: "Failed to save changes" });
            return prev;
          },
          {
            optimisticData: (currentData) =>
              applyDataGridChanges({
                currentData,
                changes: ctx.changes,
                getRowId: (r) => r.id,
              }),
          },
        );

        return true;
      },
    },
  });

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() => {
          mutate(
            async () => {
              await delay(1);
              throw new Error("Meh");
            },
            {
              rollbackOnError: true,
              optimisticData: [],
            },
          );
        }}
      >
        Mutate
      </Button>

      <table.AppTable>
        <table.Layout disabledAddRows>
          <table.Table
            variant="bordered"
            containerProps={{ className: "border-x-0" }}
          />
        </table.Layout>
      </table.AppTable>

      <UserDetailDialog data={detailData} setData={setDetailData} />
    </>
  );
}

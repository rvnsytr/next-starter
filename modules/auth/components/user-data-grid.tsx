"use client";

import { User } from "@/core/auth";
import { Button } from "@/core/components/ui/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/core/components/ui/menu";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { applyDataGridChanges } from "@/core/modules/table/utils";
import { ErrorFallback } from "@/shared/components/fallback";
import { messages } from "@/shared/messages";
import { BanIcon, MonitorOff, Settings2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { updateUserRoles } from "../actions";
import { useListUsers } from "../hooks/use-list-users";
import { useSession } from "../hooks/use-session";
import { DeleteUsersActionDialog } from "./delete-user-dialog";
import { RevokeUserSessionsActionDialog } from "./revoke-user-sessions-dialog";
import { getUserColumns } from "./user-columns";
import { UserDetailDialog } from "./user-detail-dialog";

export function UsersDataGrid() {
  const { user } = useSession();

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [detailData, setDetailData] = useState<User | null>(null);

  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const [isRevokeSessionsDialogOpen, setIsRevokeSessionsDialogOpen] =
    useState<boolean>(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] =
    useState<boolean>(false);

  const {
    data = [],
    isLoading,
    error,
    mutate,
  } = useListUsers({
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
    enableRowSelection: (row) => row.original.id !== user.id,

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
      enableCellRemoveForRow: false,

      onSave: async (ctx) => {
        const updated = ctx.changes.updated
          .map((c) => {
            const role = c.changes.role;
            if (!role) return null;

            return {
              userId: c.rowData.id,
              role,
              currentRole: c.rowData.role,
            };
          })
          .filter((u) => !!u);

        if (!updated.length) {
          toast.add({
            type: "info",
            title: "No changes to save",
            description: "You have not made any changes to save.",
          });

          return false;
        }

        if (updated.some((u) => u.role === u.currentRole)) {
          toast.add({
            type: "info",
            title: "No changes to save",
            description:
              "Some of the changes you made are identical to the current values.",
          });

          return false;
        }

        ctx.clearEdit();
        toast.add({
          type: "success",
          title: "Changes saved successfully",
          description: "Your changes have been saved successfully.",
        });

        const optimisticData = applyDataGridChanges({
          currentData: data,
          changes: ctx.changes,
          getRowId: (r) => r.id,
        });

        await mutate(
          async (prev) => {
            const res = await updateUserRoles(updated);

            if (!res.success) {
              toast.add({
                type: "error",
                title: "Failed to save changes",
                description: res.message,
              });

              return prev;
            }

            return optimisticData;
          },
          { optimisticData },
        );

        return true;
      },
    },
  });

  useEffect(() => {
    const sub = table.atoms.rowSelection.subscribe((s) =>
      setSelectedRowIds(Object.keys(s)),
    );

    return () => sub.unsubscribe();
  }, [table.atoms.rowSelection]);

  if (error)
    return <ErrorFallback error={error} className="rounded-none border-x-0" />;

  return (
    <>
      <table.AppTable>
        <table.Layout
          renderSlot={
            <Menu>
              {selectedRowIds.length > 0 && (
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
              )}

              <MenuPopup>
                <MenuItem onClick={() => setIsRevokeSessionsDialogOpen(true)}>
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
              </MenuPopup>
            </Menu>
          }
          disabledAddRows
        >
          <table.Table
            variant="bordered"
            containerProps={{ className: "border-x-0" }}
          />
        </table.Layout>
      </table.AppTable>

      <UserDetailDialog data={detailData} setData={setDetailData} />

      <RevokeUserSessionsActionDialog
        userIds={selectedRowIds}
        open={isRevokeSessionsDialogOpen}
        setOpen={setIsRevokeSessionsDialogOpen}
        setIsLoading={setIsActionLoading}
        onSuccess={() => {
          setIsRevokeSessionsDialogOpen(false);
          table.resetRowSelection();
          mutate();
        }}
      />

      <DeleteUsersActionDialog
        userIds={selectedRowIds}
        open={isDeleteUserDialogOpen}
        loading={isActionLoading}
        setOpen={setIsDeleteUserDialogOpen}
        setIsLoading={setIsActionLoading}
        onSuccess={() => {
          setIsDeleteUserDialogOpen(false);
          table.resetRowSelection();
          mutate();
        }}
      />
    </>
  );
}

"use client";

import { AuthSession } from "@/core/auth";
import { authClient } from "@/core/auth-client";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/core/components/ui/alert-dialog";
import { Button } from "@/core/components/ui/button";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { MonitorOffIcon } from "lucide-react";
import React from "react";
import { mutateListUserSessions } from "../hooks/use-list-user-sessions";

export function RevokeUserSessionsDialog({
  data,
  open,
  setOpen,
  setIsLoading,
}: {
  data: Pick<AuthSession["user"], "id" | "name">;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(
      authClient.admin.revokeUserSessions({ userId: data.id }).then((res) => {
        if (res.error) throw res.error;
        return res;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsLoading(false);
          mutateListUserSessions(data.id);
          return {
            title: messages.success,
            description: (
              <span>
                Seluruh sesi <b>{data.name}</b> berhasil diakhiri.
              </span>
            ),
          };
        },
        error: (e) => {
          setIsLoading(false);
          return { title: messages.error, description: e.message };
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <MonitorOffIcon /> Akhiri Semua Sesi {data.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Semua sesi aktif milik <b>{data.name}</b> akan diakhiri, termasuk
            sesi saat ini. Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogClose
            render={<Button variant="ghost">{messages.actions.cancel}</Button>}
          />
          <AlertDialogClose
            render={
              <Button onClick={clickHandler} autoFocus>
                {messages.actions.confirm}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

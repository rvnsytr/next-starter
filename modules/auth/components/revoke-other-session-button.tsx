"use client";

import { authClient } from "@/core/auth-client";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/core/components/ui/alert-dialog";
import { Button } from "@/core/components/ui/button";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { MonitorOffIcon } from "lucide-react";
import { useState } from "react";
import { mutateListSessions } from "../hooks/use-list-sessions";

export function RevokeOtherSessionsButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(
      authClient.revokeOtherSessions().then((res) => {
        if (res.error) throw res.error;
        return res;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsLoading(false);
          mutateListSessions();
          return { title: "Semua sesi aktif lainnya berhasil diakhiri." };
        },
        error: (e) => {
          setIsLoading(false);
          return { title: e.message };
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="outline" disabled={isLoading}>
            <LoadingSpinner
              loading={isLoading}
              icon={{ base: <MonitorOffIcon /> }}
            />
            Akhiri Semua Sesi Lain
          </Button>
        }
      />
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <MonitorOffIcon /> Akhiri Semua Sesi di Perangkat Lain
          </AlertDialogTitle>
          <AlertDialogDescription>
            Semua sesi aktif di perangkat lain akan diakhiri, kecuali sesi ini.
            Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose
            render={<Button variant="ghost">{messages.actions.cancel}</Button>}
          />
          <AlertDialogClose
            render={
              <Button variant="destructive" onClick={clickHandler} autoFocus>
                {messages.actions.confirm}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

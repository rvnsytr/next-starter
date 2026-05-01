"use client";

import { User } from "@/core/auth";
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
import { LockKeyholeOpenIcon } from "lucide-react";
import { unbanUser } from "../actions";
import { mutateUserDataTable } from "./user-data-table";

export function UnbanUserDialog({
  data,
  open,
  setOpen,
  setIsLoading,
  setData,
}: {
  data: User;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(unbanUser({ userId: data.id }), {
      loading: { title: messages.loading },
      success: () => {
        setIsLoading(false);
        setData({ ...data, banned: false, banReason: null, banExpires: null });
        mutateUserDataTable();
        return {
          title: messages.success,
          description: (
            <span>
              Akun atas nama <b>{data.name}</b> berhasil dibuka.
            </span>
          ),
        };
      },
      error: (e) => {
        setIsLoading(false);
        setData(data);
        return { title: messages.error, description: e.message };
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <LockKeyholeOpenIcon /> Buka Blokir {data.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            PERINGATAN: Tindakan ini akan membuka blokir mengaktifkan kembali
            akun milik <b>{data.name}</b>. Harap berhati-hati sebelum
            melanjutkan.
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

// TODO: function ActionUnbanUserDialog() {}

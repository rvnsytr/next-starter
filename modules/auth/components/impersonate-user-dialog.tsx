'use client";';

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
import { Layers2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { impersonateUser } from "../actions";
import { roleConfig } from "../config";

export function ImpersonateUserDialog({
  data,
  open,
  setOpen,
  setIsLoading,
}: {
  data: Pick<User, "id" | "name">;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(impersonateUser(data.id), {
      loading: { title: messages.loading },
      success: (res) => {
        setIsLoading(false);
        const to =
          res.user.role === "admin" ? "/dashboard/users" : "/dashboard";
        router.push(to);
        return {
          title: messages.success,
          description: <span>Anda sekarang masuk sebagai {data.name}.</span>,
        };
      },
      error: (e) => {
        setIsLoading(false);
        return { title: messages.error, description: e.message };
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Layers2Icon /> Impersonasi {data.name}
          </AlertDialogTitle>
          <div className="grid gap-y-2">
            <AlertDialogDescription>
              <b>Mode Impersonasi</b> adalah fitur khusus{" "}
              <b>{roleConfig.admin.label}</b> yang memungkinkan Anda masuk ke
              akun pengguna lain tanpa harus mengetahui kata sandi mereka.
            </AlertDialogDescription>

            <AlertDialogDescription>
              Saat dalam <b>Mode Impersonasi</b>, Anda akan memiliki akses penuh
              ke akun pengguna yang dipilih <b>( {data.name} )</b>. Yakin ingin
              melanjutkan?
            </AlertDialogDescription>
          </div>
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

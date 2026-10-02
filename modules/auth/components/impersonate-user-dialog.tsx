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
import { messages } from "@/shared/messages";
import { Layers2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { impersonateUser } from "../actions";
import { ROLE_META } from "../constants/role-meta";

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

  const onClick = () => {
    setIsLoading(true);
    toast.promise(impersonateUser(data.id), {
      loading: { title: messages.loading },
      success: (res) => {
        setIsLoading(false);
        setOpen(false);

        const to =
          res.user.role === "admin" ? "/dashboard/users" : "/dashboard";
        router.push(to);

        return {
          title: messages.success,
          description: <span>You are now signed in as {data.name}.</span>,
        };
      },
      error: (e) => {
        setIsLoading(false);
        setOpen(false);

        return { title: messages.error, description: e.message };
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Layers2Icon /> Impersonate {data.name}
          </AlertDialogTitle>
          <div className="grid gap-y-2">
            <AlertDialogDescription>
              <b>Impersonation Mode</b> is an <b>{ROLE_META.admin.label}</b>
              -only feature that lets you sign in to another user's account
              without knowing their password.
            </AlertDialogDescription>

            <AlertDialogDescription>
              While in <b>Impersonation Mode</b>, you will have full access to
              the selected user's account <b>({data.name})</b>. Do you want to
              continue?
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogClose
            render={<Button variant="ghost">{messages.actions.cancel}</Button>}
          />
          <AlertDialogClose
            render={
              <Button onClick={onClick} autoFocus>
                {messages.actions.confirm}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

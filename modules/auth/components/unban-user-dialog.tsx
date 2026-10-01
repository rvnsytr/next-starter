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
import { LockKeyholeOpenIcon } from "lucide-react";
import { unbanUser } from "../actions";
import { mutateListUsers } from "../hooks/use-list-users";

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
  const onClick = () => {
    setIsLoading(true);
    toast.promise(unbanUser({ userId: data.id }), {
      loading: { title: messages.loading },
      success: () => {
        setIsLoading(false);

        setData({ ...data, banned: false, banReason: null, banExpires: null });
        mutateListUsers();

        return {
          title: messages.success,
          description: (
            <span>
              The account for <b>{data.name}</b> has been unbanned.
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
            <LockKeyholeOpenIcon /> Unban {data.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            WARNING: This will unban and reactivate <b>{data.name}</b>'s
            account. Proceed with caution.
          </AlertDialogDescription>
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

// TODO: function ActionUnbanUserDialog() {}

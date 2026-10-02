"use client";

import { User } from "@/core/auth";
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
import { messages } from "@/shared/messages";
import { MonitorOffIcon } from "lucide-react";
import { mutateListUserSessions } from "../hooks/use-list-user-sessions";

export function RevokeUserSessionsDialog({
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
  const onClick = () => {
    setIsLoading(true);
    toast.promise(
      authClient.admin.revokeUserSessions({ userId: data.id }).then((res) => {
        if (res.error) throw res.error;
        return res.data;
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
                All sessions for <b>{data.name}</b> have been ended.
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
            <MonitorOffIcon /> End all sessions for {data.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            All active sessions for <b>{data.name}</b> will be ended, including
            the current session. Do you want to continue?
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

export function RevokeUserSessionsActionDialog({
  userIds,
  open,
  setOpen,
  setIsLoading,
  onSuccess,
}: {
  userIds: string[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}) {
  const onClick = () => {
    setIsLoading(true);

    toast.promise(
      Promise.all(
        userIds.map(async (userId) => {
          return await authClient.admin.revokeUserSessions({ userId });
        }),
      ),
      {
        loading: { title: messages.loading },
        success: (res) => {
          setIsLoading(false);
          onSuccess();
          const successLength = res.filter((r) => r.data?.success).length;
          return {
            title: messages.success,
            description: (
              <span>
                {successLength} of {userIds.length} user sessions were ended
                successfully.
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
            <MonitorOffIcon /> End sessions for {userIds.length} users
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will end all active sessions for the{" "}
            <span>{userIds.length} selected users</span>. Do you want to
            continue?
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

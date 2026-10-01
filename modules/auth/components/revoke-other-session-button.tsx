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
import { messages } from "@/shared/messages";
import { MonitorOffIcon } from "lucide-react";
import { useState } from "react";
import { mutateListSessions } from "../hooks/use-list-sessions";

export function RevokeOtherSessionsButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClick = () => {
    setIsLoading(true);
    toast.promise(
      authClient.revokeOtherSessions().then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsLoading(false);
          mutateListSessions();
          return { title: "All other active sessions have been signed out." };
        },
        error: (e) => {
          setIsLoading(false);
          return { title: messages.error, description: e.message };
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
            Sign out all other sessions
          </Button>
        }
      />
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <MonitorOffIcon /> Sign out all sessions on other devices
          </AlertDialogTitle>
          <AlertDialogDescription>
            All active sessions on other devices will be signed out, except this
            one. Do you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose
            render={<Button variant="ghost">{messages.actions.cancel}</Button>}
          />
          <AlertDialogClose
            render={
              <Button variant="destructive" onClick={onClick} autoFocus>
                {messages.actions.confirm}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { Layers2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { stopImpersonateUser } from "../actions";
import { roleConfig } from "../config";
import { useSession } from "../hooks/use-session";

export function StopImpersonateUserMenuItem() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { session, user } = useSession();
  if (!session.impersonatedBy) return;

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(stopImpersonateUser(), {
      loading: { title: messages.loading },
      success: () => {
        setIsLoading(false);
        router.push("/dashboard/users");
        return {
          title: messages.success,
          description: (
            <span>
              Anda telah kembali ke sesi <b>{roleConfig.admin.label}</b> Anda.
            </span>
          ),
        };
      },
      error: (e) => {
        setIsLoading(false);
        return { title: messages.error, description: e.message };
      },
    });
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={`Keluar dari sesi ${user.name}`}
        variant="destructive-ghost"
        onClick={clickHandler}
        disabled={isLoading}
      >
        <LoadingSpinner loading={isLoading} icon={{ base: <Layers2Icon /> }} />
        Kembali ke akun saya
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

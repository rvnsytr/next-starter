"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/shared/messages";
import { Layers2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { stopImpersonateUser } from "../actions";
import { ROLE_META } from "../constants/role-meta";
import { useSession } from "../hooks/use-session";

export function StopImpersonateUserMenuItem() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { session, user } = useSession();
  if (!session.impersonatedBy) return;

  const onClick = () => {
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
              You are back in your <b>{ROLE_META.admin.label}</b> session.
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
        tooltip={`Exit ${user.name}'s session`}
        variant="destructive-ghost"
        onClick={onClick}
        disabled={isLoading}
      >
        <LoadingSpinner loading={isLoading} icon={{ base: <Layers2Icon /> }} />
        Back to my account
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

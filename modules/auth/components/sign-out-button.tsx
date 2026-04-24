"use client";

import { authClient } from "@/core/auth-client";
import { SidebarMenuButton } from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function signOutClient({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
} = {}) {
  toast.promise(
    authClient.signOut().then((res) => {
      if (res.error) throw res.error;
      return res;
    }),
    {
      loading: { title: messages.loading },
      success: () => {
        onSuccess?.();
        return { title: "Berhasil keluar - Sampai jumpa!" };
      },
      error: (e) => {
        onError?.(e);
        return { title: e.message };
      },
    },
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    signOutClient({
      onSuccess: () => router.push("/sign-in"),
      onError: () => setIsLoading(false),
    });
  };

  return (
    <SidebarMenuButton
      tooltip="Keluar"
      variant="destructive-ghost"
      disabled={isLoading}
      onClick={clickHandler}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <LogOutIcon /> }} />
      Keluar
    </SidebarMenuButton>
  );
}

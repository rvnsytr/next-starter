"use client";

import { authClient } from "@/core/auth-client";
import { SidebarMenuButton } from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { createSignInURL } from "@/core/route";
import { messages } from "@/shared/messages";
import { LogOutIcon } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function signOutClient({
  onSuccess,
  onError,
}: {
  onSuccess?: (url: string) => void;
  onError?: (e: Error) => void;
} = {}) {
  toast.promise(
    authClient.signOut().then((res) => {
      if (res.error) throw res.error;
      return res.data;
    }),
    {
      loading: { title: messages.loading },
      success: () => {
        onSuccess?.(createSignInURL(location));
        return { title: "Berhasil keluar - Sampai jumpa!" };
      },
      error: (e) => {
        onError?.(e);
        return { title: messages.error, description: e.message };
      },
    },
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClick = () => {
    setIsLoading(true);
    signOutClient({
      onSuccess: (url) => router.push(url as Route),
      onError: () => setIsLoading(false),
    });
  };

  return (
    <SidebarMenuButton
      tooltip="Keluar"
      variant="destructive-ghost"
      onClick={onClick}
      disabled={isLoading}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <LogOutIcon /> }} />
      Keluar
    </SidebarMenuButton>
  );
}

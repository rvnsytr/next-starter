"use client";

import { authClient } from "@/core/auth-client";
import { SidebarMenuButton } from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(
      (async () => {
        const res = await authClient.signOut();
        if (res.error) throw res.error;
        return res;
      })(),
      {
        loading: { title: messages.loading },
        success: () => {
          router.push("/sign-in");
          return { title: "Berhasil keluar", description: "Sampai jumpa!" };
        },
        error: (e) => {
          setIsLoading(false);
          return { type: "error", title: e.message };
        },
      },
    );
  };

  return (
    <SidebarMenuButton
      tooltip="Keluar"
      // variant="destructive-outline"
      disabled={isLoading}
      onClick={clickHandler}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <LogOutIcon /> }} />
      Keluar
    </SidebarMenuButton>
  );
}

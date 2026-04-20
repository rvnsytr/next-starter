"use client";

import { authClient } from "@/core/auth-client";
import { buttonVariants } from "@/core/components/ui/button";
import { SidebarMenuButton } from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { cn } from "@/core/utils";
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
      disabled={isLoading}
      onClick={clickHandler}
      className={cn(
        buttonVariants({ size: "sm", variant: "destructive-ghost" }),
        "hover:text-destructive justify-start",
      )}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <LogOutIcon /> }} />
      Keluar
    </SidebarMenuButton>
  );
}

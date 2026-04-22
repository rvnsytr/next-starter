"use client";

import { authClient } from "@/core/auth-client";
import { Button } from "@/core/components/ui/button";
import { GithubIcon } from "@/core/components/ui/icons";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { useState } from "react";

export function SignOnGithubButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const wasLastUsed = authClient.isLastUsedLoginMethod("github");

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(
      authClient.signIn
        .social({
          provider: "github",
          callbackURL: "/dashboard",
          errorCallbackURL: "/sign-in",
        })
        .then((res) => {
          if (res.error) throw res.error;
          return res;
        }),
      {
        loading: { title: messages.loading },
        success: (res) => {
          const name = "user" in res.data ? res.data.user.name : undefined;
          return {
            type: "success",
            title: "Berhasil masuk!",
            description: `Selamat datang${name ? ` ${name}` : ""}!`,
          };
        },
        error: (e) => {
          setIsLoading(false);
          return { type: "error", title: e.message };
        },
      },
    );
  };

  return (
    <Button
      variant="outline"
      disabled={isLoading}
      className="relative"
      onClick={clickHandler}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <GithubIcon /> }} />
      Lanjutankan dengan Github
      {/* {wasLastUsed && (
        <Badge
          variant="outline"
          className="bg-card absolute -top-3 right-1 shadow"
        >
          {sharedText.lastUsed}
        </Badge>
      )} */}
    </Button>
  );
}

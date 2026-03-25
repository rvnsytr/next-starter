"use client";

import { useCopyToClipboard } from "@/core/hooks/use-copy-to-clipboard";
import { cn, delay } from "@/core/utils/helpers";
import { ArrowUpIcon, CheckIcon, CopyIcon, RefreshCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonProps } from "./button";
import { LoadingSpinner } from "./spinner";

type ButtonIconSize = "icon-xs" | "icon-sm" | "icon" | "icon-lg";

export function CopyButton({
  value,
  size = "icon",
  disabled,
  onClick,
  ...props
}: Omit<Omit<ButtonProps, "children">, "value" | "size"> & {
  value: string;
  size?: ButtonIconSize;
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button
      size={size}
      disabled={isCopied || disabled}
      onClick={(e) => {
        onClick?.(e);
        copyToClipboard(value);
      }}
      {...props}
    >
      <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
      <CopyIcon
        className={cn("transition", isCopied ? "scale-0" : "scale-100")}
      />
      <CheckIcon
        className={cn(
          "absolute transition",
          isCopied ? "scale-100" : "scale-0",
        )}
      />
    </Button>
  );
}

export function RefreshButton({
  text = "Muat Ulang",
  disabled,
  onClick,
  ...props
}: Omit<ButtonProps, "children"> & { text?: string }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <Button
      disabled={refreshing || disabled}
      onClick={async (e) => {
        onClick?.(e);
        setRefreshing(true);
        await delay(0.5);
        router.refresh();
        setRefreshing(false);
      }}
      {...props}
    >
      <LoadingSpinner
        variant="refresh"
        loading={refreshing}
        className="animate-reverse"
        icon={{ base: <RefreshCcwIcon /> }}
      />
      {text}
    </Button>
  );
}

export function ScrollToTopButton({
  size = "icon-lg",
  className,
  onClick,
  ...props
}: Omit<ButtonProps, "children">) {
  return (
    <Button
      size={size}
      className={cn(
        "fixed right-6 bottom-6 z-40 rounded-full lg:right-10 lg:bottom-8",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        window.scrollTo(0, 0);
      }}
      {...props}
    >
      <ArrowUpIcon className="size-5" />
    </Button>
  );
}

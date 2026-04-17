"use client";

import { useCopyToClipboard } from "@/core/hooks/use-copy-to-clipboard";
import { cn } from "@/core/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button, ButtonIconSize, ButtonProps } from "./button";

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
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <Button
      data-slot="copy-button"
      size={size}
      disabled={isCopied || disabled}
      onClick={(e) => {
        onClick?.(e);
        copy(value);
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

"use client";

import { useCopyToClipboard } from "@/core/hooks/use-copy-to-clipboard";
import { cn } from "@/core/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { TextMorph } from "torph/react";
import { Button, ButtonProps } from "./button";

const defaultLabel = { copy: "Copy", copied: "Copied" };

export function CopyButton({
  value,
  label,
  size,
  disabled,
  onClick,
  ...props
}: Omit<Omit<ButtonProps, "children">, "value"> & {
  value: string;
  label?: string | { copy: string; copied: string };
}) {
  const { copy, isCopied } = useCopyToClipboard();

  const labels =
    typeof label === "string"
      ? { copy: label, copied: label }
      : { copy: label?.copy ?? "Copy", copied: label?.copied ?? "Copied" };

  return (
    <Button
      data-slot="copy-button"
      aria-label={isCopied ? defaultLabel.copied : defaultLabel.copy}
      size={size ?? (!!label ? "default" : "icon")}
      disabled={isCopied || disabled}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        copy(value);
      }}
      {...props}
    >
      <span className="relative">
        <CopyIcon
          className={cn(
            "transition-transform",
            isCopied ? "scale-0" : "scale-100",
          )}
        />

        <CheckIcon
          className={cn(
            "absolute inset-0 transition-transform",
            isCopied ? "scale-100" : "scale-0",
          )}
        />
      </span>

      {!!label &&
        (typeof label === "string" ? (
          <span>{label}</span>
        ) : (
          <TextMorph>{isCopied ? labels.copied : labels.copy}</TextMorph>
        ))}
    </Button>
  );
}

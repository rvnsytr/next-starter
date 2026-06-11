"use client";

import { cn } from "@/core/utils";
import { ArrowUpIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";

export function ScrollToTopButton({
  size,
  className,
  onClick,
  children,
  ...props
}: ButtonProps) {
  return (
    <Button
      data-slot="scroll-to-top-button"
      size={size ?? (!!children ? "default" : "icon-lg")}
      className={cn(
        "fixed right-6 bottom-6 z-40 lg:right-10 lg:bottom-8",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        window.scrollTo(0, 0);
      }}
      {...props}
    >
      {children ?? <ArrowUpIcon />}
    </Button>
  );
}

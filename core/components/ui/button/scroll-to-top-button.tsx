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
  const hasChildren = !!children;
  return (
    <Button
      data-slot="scroll-to-top-button"
      size={size ?? (hasChildren ? "default" : "icon-lg")}
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
      {children ?? <ArrowUpIcon className="size-5" />}
    </Button>
  );
}

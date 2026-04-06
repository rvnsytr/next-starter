"use client";

import { cn } from "@/core/utils/helpers";
import { ArrowUpIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";

export function ScrollToTopButton({
  size = "icon-lg",
  className,
  onClick,
  ...props
}: Omit<ButtonProps, "children">) {
  return (
    <Button
      data-slot="scroll-to-top-button"
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

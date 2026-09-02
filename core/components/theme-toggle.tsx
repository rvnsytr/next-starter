"use client";

import { Theme, THEME_META, THEME_TOGGLE_HOTKEY } from "@/shared/constants";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { ComponentProps } from "react";
import { useIsMounted } from "../hooks/use-is-mounted";
import { useIsMobile } from "../hooks/use-media-query";
import { cn } from "../utils";
import { Button, ButtonProps, buttonVariants } from "./ui/button";
import { Kbd } from "./ui/kbd";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";

export const THEME_TOGGLE_HOTKEY_DISPLAY =
  formatForDisplay(THEME_TOGGLE_HOTKEY);

export const nextTheme = (currentTheme?: string) => {
  if (currentTheme === "light") return "dark";
  if (currentTheme === "dark") return "system";
  return "light";
};

export function ThemeToggle({
  withTooltip = true,
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  className,
  disabled = false,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<ComponentProps<typeof TooltipPopup>, "align"> & {
    withTooltip?: boolean;
  }) {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const { theme: currentTheme, setTheme } = useTheme();

  const { icon: Icon } = THEME_META[(currentTheme ?? "system") as Theme];

  if (!isMounted)
    return <Skeleton className={cn(buttonVariants({ size }), className)} />;

  const element = (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        onClick?.(e);
        setTheme(nextTheme(currentTheme));
      }}
      className={className}
      disabled={disabled}
      {...props}
    >
      <Icon />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );

  if (isMobile || !withTooltip) return element;

  return (
    <Tooltip>
      <TooltipTrigger render={element} />
      <TooltipPopup align={align}>
        <div className="flex items-center gap-x-1">
          Toggle Theme <Kbd>{THEME_TOGGLE_HOTKEY_DISPLAY}</Kbd>
        </div>
      </TooltipPopup>
    </Tooltip>
  );
}

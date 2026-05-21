"use client";

import { LoadingFallback } from "@/shared/components/fallback";
import {
  nextTheme,
  Theme,
  themeConfig,
  themeToggleConfig,
} from "@/shared/config";
import { useTheme } from "next-themes";
import { ComponentProps } from "react";
import { useIsMounted } from "../hooks/use-is-mounted";
import { useIsMobile } from "../hooks/use-media-query";
import { useViewTransition } from "../hooks/use-view-transition";
import { cn } from "../utils";
import { Button, ButtonProps, buttonVariants } from "./ui/button";
import { Kbd } from "./ui/kbd";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";

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
  const { theme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  const currentTheme = (theme ?? "system") as Theme;
  const { icon: Icon } = themeConfig[currentTheme];

  if (!isMounted)
    return <Skeleton className={cn(buttonVariants({ size }), className)} />;

  const element = (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        onClick?.(e);
        startTransition(() => setTheme(nextTheme));
      }}
      className={className}
      disabled={disabled || isTransitioning}
      {...props}
    >
      <Icon />
      <span className="sr-only">{themeToggleConfig.label}</span>
    </Button>
  );

  if (isMobile || !withTooltip) return element;

  return (
    <Tooltip>
      <TooltipTrigger render={element} />
      <TooltipPopup align={align}>
        <div className="flex items-center gap-x-1">
          {themeToggleConfig.label} <Kbd>{themeToggleConfig.hotkeyDisplay}</Kbd>
        </div>
      </TooltipPopup>
    </Tooltip>
  );
}

export function ThemeSettings() {
  const isMounted = useIsMounted();
  const { theme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  if (!isMounted) return <LoadingFallback variant="frame" />;

  return (
    <RadioGroup
      value={theme}
      defaultValue="system"
      onValueChange={(v) => startTransition(() => setTheme(v))}
      className="grid grid-cols-3"
      disabled={isTransitioning}
    >
      {Object.entries(themeConfig).map(([k, { icon: Icon }]) => (
        <Label key={k} className="justify-center capitalize" asCard>
          <RadioGroupItem value={k} hidden />
          <Icon /> {k}
        </Label>
      ))}
    </RadioGroup>
  );
}

"use client";

import { LoadingFallback } from "@/shared/components/fallback";
import { formatForDisplay, Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
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

export type Theme = (typeof allThemes)[number];
export const allThemes = ["light", "system", "dark"] as const;

export const themeToggleConfig: {
  label: string;
  hotkey: Hotkey;
  hotkeyDisplay: string;
} = {
  label: "Toggle Theme",
  hotkey: "D",
  get hotkeyDisplay() {
    return formatForDisplay(this.hotkey);
  },
};

export const themeConfig: Record<Theme, { icon: LucideIcon }> = {
  light: { icon: SunIcon },
  system: { icon: MonitorIcon },
  dark: { icon: MoonIcon },
};

export function nextTheme(currentTheme?: string) {
  if (currentTheme === "light") return "dark";
  if (currentTheme === "dark") return "system";
  return "light";
}

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

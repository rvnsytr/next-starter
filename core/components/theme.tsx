"use client";

import { formatForDisplay, Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ComponentProps } from "react";
import { useIsMounted } from "../hooks/use-is-mounted";
import { useIsMobile } from "../hooks/use-media-query";
import { useViewTransition } from "../hooks/use-view-transition";
import { Button, ButtonProps } from "./ui/button";
import { LoadingFallback } from "./ui/fallback";
import { Kbd } from "./ui/kbd";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";

export type Theme = (typeof allThemes)[number];
export const allThemes = ["light", "system", "dark"] as const;

export const THEME_TOGGLE_HOTKEY: Hotkey = "Alt+T";

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
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  disabled = false,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<ComponentProps<typeof TooltipPopup>, "align">) {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const { theme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  const label = "Toggle Theme";
  const currentTheme = (theme ?? "system") as Theme;
  const { icon: Icon } = themeConfig[currentTheme];

  if (!isMounted) {
    const { icon: DefaultIcon } = themeConfig.system;
    return (
      <Button size={size} variant={variant} disabled>
        <DefaultIcon />
      </Button>
    );
  }

  const element = (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        onClick?.(e);
        startTransition(() => setTheme(nextTheme));
      }}
      disabled={disabled || isTransitioning}
      {...props}
    >
      <Icon />
      <span className="sr-only">{label}</span>
    </Button>
  );

  if (isMobile) return element;

  return (
    <Tooltip>
      <TooltipTrigger render={element} />
      <TooltipPopup align={align}>
        <div className="flex items-center gap-x-1">
          {label} <Kbd>{formatForDisplay(THEME_TOGGLE_HOTKEY)}</Kbd>
        </div>
      </TooltipPopup>
    </Tooltip>
  );
}

export function ThemeSettings() {
  const isMounted = useIsMounted();
  const { theme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  if (!isMounted) return <LoadingFallback />;

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

"use client";

import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { useIsMobile } from "@/core/hooks/use-media-query";
import { formatForDisplay, Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ComponentProps } from "react";
import { Button, ButtonProps } from "./button";
import { LoadingFallback } from "./fallback";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./field";
import { Kbd } from "./kbd";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./tooltip";

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
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<ComponentProps<typeof TooltipPopup>, "align">) {
  const isMounted = useIsMounted();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

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
        setTheme(nextTheme);
      }}
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

  if (!isMounted) return <LoadingFallback />;

  return (
    <RadioGroup
      value={theme}
      defaultValue="system"
      onValueChange={setTheme}
      className="grid grid-cols-3"
      required
    >
      {Object.entries(themeConfig).map(([k, { icon: Icon }]) => (
        <FieldLabel key={k} htmlFor={`rd-theme-${k}`}>
          <Field>
            <FieldContent className="items-center">
              <FieldTitle className="flex-col capitalize md:flex-row">
                <Icon /> {k}
              </FieldTitle>
            </FieldContent>
            <RadioGroupItem id={`rd-theme-${k}`} value={k} hidden />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}

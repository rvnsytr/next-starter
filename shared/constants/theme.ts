import { Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

export type Theme = (typeof THEMES)[number];

export const THEMES = ["light", "dark", "system"] as const;

export const THEME_TOGGLE_HOTKEY: Hotkey = "D";

export const THEME_META: Record<Theme, { icon: LucideIcon }> = {
  light: { icon: SunIcon },
  system: { icon: MonitorIcon },
  dark: { icon: MoonIcon },
};

import { formatForDisplay, Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

export type Theme = (typeof allThemes)[number];
export const allThemes = ["light", "system", "dark"] as const;

export const themeConfig: Record<Theme, { icon: LucideIcon }> = {
  light: { icon: SunIcon },
  system: { icon: MonitorIcon },
  dark: { icon: MoonIcon },
};

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

export function nextTheme(currentTheme?: string) {
  if (currentTheme === "light") return "dark";
  if (currentTheme === "dark") return "system";
  return "light";
}

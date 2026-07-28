import { Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

export type Theme = (typeof values)[number];

const values = ["light", "dark", "system"] as const;

const hotkey: Hotkey = "D";

const meta: Record<Theme, { icon: LucideIcon; hotkey: Hotkey }> = {
  light: { icon: SunIcon, hotkey },
  system: { icon: MonitorIcon, hotkey },
  dark: { icon: MoonIcon, hotkey },
};

const next = (currentTheme?: string) => {
  if (currentTheme === "light") return "dark";
  if (currentTheme === "dark") return "system";
  return "light";
};

export const themes = {
  hotkey,
  values,
  meta,
  next,
};

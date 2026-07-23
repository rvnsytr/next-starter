import { Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

export type Theme = "light" | "dark" | "system";

export const themes = {
  hotkey: "D" as Hotkey,

  get values(): Theme[] {
    return Object.keys(this.meta) as Theme[];
  },

  get meta(): Record<Theme, { icon: LucideIcon }> {
    return {
      light: { icon: SunIcon },
      system: { icon: MonitorIcon },
      dark: { icon: MoonIcon },
    };
  },

  next(currentTheme?: string) {
    if (currentTheme === "light") return "dark";
    if (currentTheme === "dark") return "system";
    return "light";
  },
};

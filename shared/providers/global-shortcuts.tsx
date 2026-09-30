"use client";

import { nextTheme } from "@/core/components/theme-toggle";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { THEME_TOGGLE_HOTKEY } from "../constants";

export function GlobalShortcuts() {
  const { theme, setTheme } = useTheme();

  useHotkeys([
    {
      hotkey: THEME_TOGGLE_HOTKEY,
      callback: () => setTheme(nextTheme(theme)),
    },
  ]);

  return null;
}

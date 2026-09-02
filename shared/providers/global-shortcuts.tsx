"use client";

import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { nextTheme, THEME_TOGGLE_HOTKEY } from "../constants";

export function GlobalShortcuts() {
  const { theme: currentTheme, setTheme } = useTheme();

  useHotkeys([
    {
      hotkey: THEME_TOGGLE_HOTKEY,
      callback: () => setTheme(nextTheme(currentTheme)),
    },
  ]);

  return null;
}

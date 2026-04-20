"use client";

import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { nextTheme, THEME_TOGGLE_HOTKEY } from "../components/theme";

export function GlobalShortcuts() {
  const { setTheme } = useTheme();

  useHotkeys([
    {
      hotkey: THEME_TOGGLE_HOTKEY,
      callback: () => {
        if (!document.startViewTransition) return setTheme(nextTheme);
        document.startViewTransition(() => setTheme(nextTheme));
      },
    },
  ]);

  return null;
}

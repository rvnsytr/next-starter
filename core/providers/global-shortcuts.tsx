"use client";

import { THEME_TOGGLE_HOTKEY } from "@/core/components/ui/theme";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { nextTheme } from "../components/ui/theme";

export function GlobalShortcuts() {
  const { setTheme } = useTheme();

  useHotkeys([
    { hotkey: THEME_TOGGLE_HOTKEY, callback: () => setTheme(nextTheme) },
  ]);

  return null;
}

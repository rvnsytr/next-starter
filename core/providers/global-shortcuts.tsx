"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { nextTheme } from "../components/ui/theme";
import { THEME_TOGGLE_HOTKEY } from "../constants/registries";

export function GlobalShortcuts() {
  const { setTheme } = useTheme();

  useHotkey(THEME_TOGGLE_HOTKEY, () => setTheme(nextTheme));

  return null;
}

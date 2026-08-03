"use client";

import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { themes } from "../constants";

export function GlobalShortcuts() {
  const { theme: currentTheme, setTheme } = useTheme();

  useHotkeys([
    {
      hotkey: themes.hotkey,
      callback: () => setTheme(themes.next(currentTheme)),
    },
  ]);

  return null;
}

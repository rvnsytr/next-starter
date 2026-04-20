"use client";

import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { nextTheme, THEME_TOGGLE_HOTKEY } from "../components/theme";
import { useViewTransition } from "../hooks/use-view-transition";

export function GlobalShortcuts() {
  const { setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  useHotkeys(
    [
      {
        hotkey: THEME_TOGGLE_HOTKEY,
        callback: () => startTransition(() => setTheme(nextTheme)),
      },
    ],
    { enabled: !isTransitioning },
  );

  return null;
}

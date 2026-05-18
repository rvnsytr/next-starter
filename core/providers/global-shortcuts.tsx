"use client";

import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { nextTheme, themeToggleConfig } from "../components/theme";
import { useViewTransition } from "../hooks/use-view-transition";

export function GlobalShortcuts() {
  const { setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  useHotkeys(
    [
      {
        hotkey: themeToggleConfig.hotkey,
        callback: () => startTransition(() => setTheme(nextTheme)),
      },
    ],
    { enabled: !isTransitioning },
  );

  return null;
}

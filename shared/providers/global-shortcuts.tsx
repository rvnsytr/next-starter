"use client";

import { useViewTransition } from "@/core/hooks/use-view-transition";
import { nextTheme, themeToggleConfig } from "@/shared/config";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";

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

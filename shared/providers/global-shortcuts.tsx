"use client";

import { useViewTransition } from "@/core/hooks/use-view-transition";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import { themes } from "../metadata";

export function GlobalShortcuts() {
  const { theme: currentTheme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  useHotkeys(
    [
      {
        hotkey: themes.hotkey,
        callback: () =>
          startTransition(() => setTheme(themes.next(currentTheme))),
      },
    ],
    { enabled: !isTransitioning },
  );

  return null;
}

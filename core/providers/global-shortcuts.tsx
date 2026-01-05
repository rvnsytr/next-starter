"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { nextTheme } from "../components/ui/theme";

export function GlobalShortcuts() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // ? Theme
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        setTheme(nextTheme);
      }

      // more shortcuts here
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setTheme]);

  return null;
}

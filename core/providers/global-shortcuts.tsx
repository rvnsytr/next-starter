"use client";

import { useTheme } from "next-themes";
import { useEffect, useEffectEvent } from "react";

export function GlobalShortcuts() {
  const { setTheme } = useTheme();

  const onTheme = useEffectEvent(() =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark")),
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        onTheme();
      }

      // more shortcuts here
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return null;
}

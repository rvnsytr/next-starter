"use client";

import { Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon, MinimizeIcon, ScanIcon } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { cn } from "../utils";

export type LayoutMode = (typeof allLayoutMode)[number];
export const allLayoutMode = ["fullwidth", "centered"] as const;

export const LAYOUT_TOGGLE_HOTKEY: Hotkey = "Alt+L";
export const defaultLayout: LayoutMode = "centered";

export const layoutModeConfig: Record<
  LayoutMode,
  { label: string; icon: LucideIcon }
> = {
  fullwidth: { label: "Fullwidth", icon: ScanIcon },
  centered: { label: "Centered", icon: MinimizeIcon },
};

type LayoutContextType = {
  layout: LayoutMode;
  setLayout: React.Dispatch<React.SetStateAction<LayoutMode>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({
  layout: fallbackLayout,
  className,
  children,
}: {
  layout: LayoutMode;
  className?: string;
  children: React.ReactNode;
}) {
  const [layout, setLayout] = useState<LayoutMode>(fallbackLayout);

  useEffect(() => {
    document.cookie = `layout-preference=${encodeURIComponent(layout)}; path=/; max-age=31536000; samesite=lax`;
  }, [layout]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      <div
        data-layout-mode={layout}
        className={cn("group/layout-mode flex h-full flex-col", className)}
      >
        {children}
      </div>
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used in LayoutProvider");
  return ctx;
}

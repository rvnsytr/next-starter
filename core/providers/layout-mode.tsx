"use client";

import { LucideIcon, MinimizeIcon, ScanIcon } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { cn } from "../utils";

export type LayoutMode = (typeof allLayoutMode)[number];
export const allLayoutMode = ["fullwidth", "centered"] as const;
export const defaultLayout: LayoutMode = "centered";

export const layoutModeConfig: Record<
  LayoutMode,
  { label: string; icon: LucideIcon }
> = {
  fullwidth: { label: "Fullwidth", icon: ScanIcon },
  centered: { label: "Centered", icon: MinimizeIcon },
};

type LayoutModeContextType = {
  layout: LayoutMode;
  setLayout: React.Dispatch<React.SetStateAction<LayoutMode>>;
};

const LayoutModeContext = createContext<LayoutModeContextType | undefined>(
  undefined,
);

export function LayoutModeProvider({
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
    <LayoutModeContext.Provider value={{ layout, setLayout }}>
      <div
        data-layout-mode={layout}
        className={cn("group/layout-mode flex h-full flex-col", className)}
      >
        {children}
      </div>
    </LayoutModeContext.Provider>
  );
}

export function useLayoutMode() {
  const ctx = useContext(LayoutModeContext);
  if (!ctx) throw new Error("useLayoutMode must be used in LayoutModeProvider");
  return ctx;
}

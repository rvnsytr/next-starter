"use client";

import { LayoutMode } from "@/shared/config";
import { createContext, useContext, useEffect, useState } from "react";
import { cn } from "../utils";

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

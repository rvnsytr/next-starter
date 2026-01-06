"use client";

import { FrameIcon, LucideIcon, MinimizeIcon, ScanIcon } from "lucide-react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import z from "zod";

export const allLayoutMode = ["fullwidth", "centered", "unset"] as const;
export type LayoutMode = (typeof allLayoutMode)[number];

export const defaultLayout: LayoutMode = "centered";

export const layoutModeMeta: Record<
  LayoutMode,
  { displayName: string; icon: LucideIcon }
> = {
  fullwidth: { displayName: "Fullwidth", icon: ScanIcon },
  centered: { displayName: "Centered", icon: MinimizeIcon },
  unset: { displayName: "Unset", icon: FrameIcon },
};

type LayoutContextType = {
  layout: LayoutMode;
  setLayout: Dispatch<SetStateAction<LayoutMode>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState<LayoutMode>("unset");

  const onMount = useEffectEvent(() => {
    const stored = localStorage.getItem("layout-preference");
    const zodRes = z.enum(allLayoutMode).safeParse(stored);
    if (zodRes.success && zodRes.data !== "unset") setLayout(zodRes.data);
    else {
      setLayout(defaultLayout);
      localStorage.setItem("layout-preference", defaultLayout);
    }
  });

  useEffect(() => onMount(), []);

  useEffect(() => {
    if (layout !== "unset") localStorage.setItem("layout-preference", layout);
  }, [layout]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      <div
        data-layout-mode={layout}
        className="group/layout-mode flex flex-1 flex-col"
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

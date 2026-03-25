"use client";

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import z from "zod";
import {
  allLayoutMode,
  defaultLayout,
  LayoutMode,
} from "../constants/registries";

type LayoutContextType = {
  layout: LayoutMode;
  setLayout: React.Dispatch<React.SetStateAction<LayoutMode>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
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

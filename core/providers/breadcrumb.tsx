"use client";

import { routesConfig } from "@/shared/route";
import { Route } from "next";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import { getRouteHierarchy, normalizeRoute } from "../route";

type BreadcrumbContent = { href: Route; label: string };

type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbContent[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbContent[]>>;
  resetBreadcrumbs: () => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbContent[]>([]);

  const setByPathname = useCallback(() => {
    const crumbs = getRouteHierarchy(normalizeRoute(pathname)).flatMap((r) => {
      const meta = routesConfig[r];
      return meta ? [{ href: r, label: meta.label }] : [];
    });
    setBreadcrumbs(crumbs);
  }, [pathname]);

  const onPathname = useEffectEvent(() => setByPathname());
  useEffect(() => onPathname(), [pathname]);

  const onBreadcrumb = useEffectEvent(() => {
    setBreadcrumbs((prev) => {
      const next = Array.from(new Map(prev.map((c) => [c.href, c])).values());
      if (next.length === prev.length) return prev;
      return next;
    });
  });

  useEffect(() => onBreadcrumb(), [breadcrumbs]);

  const resetBreadcrumbs = useCallback(() => setByPathname(), [setByPathname]);

  const value = useMemo(
    () => ({ breadcrumbs, setBreadcrumbs, resetBreadcrumbs }),
    [breadcrumbs, resetBreadcrumbs],
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error("useBreadcrumb must be used in BreadcrumbProvider");
  return ctx;
}

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

type DynamicBreadcrumbContent = { href: Route; label: string };

type DynamicBreadcrumbContextType = {
  breadcrumbs: DynamicBreadcrumbContent[];
  setBreadcrumbs: React.Dispatch<
    React.SetStateAction<DynamicBreadcrumbContent[]>
  >;
  resetBreadcrumbs: () => void;
};

const DynamicBreadcrumbContext = createContext<
  DynamicBreadcrumbContextType | undefined
>(undefined);

export function DynamicBreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<DynamicBreadcrumbContent[]>(
    [],
  );

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
    <DynamicBreadcrumbContext.Provider value={value}>
      {children}
    </DynamicBreadcrumbContext.Provider>
  );
}

export function useDynamicBreadcrumb() {
  const ctx = useContext(DynamicBreadcrumbContext);
  if (!ctx) {
    const error =
      "useDynamicBreadcrumb must be used in DynamicBreadcrumbProvider";
    throw new Error(error);
  }
  return ctx;
}

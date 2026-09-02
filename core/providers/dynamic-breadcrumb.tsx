"use client";

import { routeConfig } from "@/shared/configs";
import { Route } from "next";
import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo, useState } from "react";
import { getRouteHierarchy, normalizeRoute } from "../route";

type DynamicBreadcrumbContent = { href: Route; label: string };

type DynamicBreadcrumbContextType = {
  breadcrumbs: DynamicBreadcrumbContent[];
  setBreadcrumbs: React.Dispatch<
    React.SetStateAction<DynamicBreadcrumbContent[]>
  >;
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
  const [breadcrumbsState, setBreadcrumbs] = useState<
    DynamicBreadcrumbContent[]
  >([]);

  const routeBreadcrumbs = useMemo(
    () =>
      getRouteHierarchy(normalizeRoute(pathname)).flatMap((r) => {
        const config = r in routeConfig ? routeConfig[r] : null;
        return config ? [{ href: r, label: config.title }] : [];
      }),
    [pathname],
  );

  const breadcrumbs = useMemo(() => {
    const crumbs = [...routeBreadcrumbs, ...breadcrumbsState];
    return Array.from(new Map(crumbs.map((c) => [c.href, c])).values());
  }, [routeBreadcrumbs, breadcrumbsState]);

  const value = useMemo(() => ({ breadcrumbs, setBreadcrumbs }), [breadcrumbs]);

  return (
    <DynamicBreadcrumbContext.Provider value={value}>
      {children}
    </DynamicBreadcrumbContext.Provider>
  );
}

export function useDynamicBreadcrumb() {
  const ctx = useContext(DynamicBreadcrumbContext);
  if (!ctx)
    throw new Error(
      "useDynamicBreadcrumb must be used in DynamicBreadcrumbProvider",
    );
  return ctx;
}

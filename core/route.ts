import { Role } from "@/modules/auth/constants";
import { Route } from "next";
import { appMeta } from "./constants/app";
import { dashboardMenu, Menu } from "./constants/menu";

export type RouteRole = "all" | Role[];

export const routesMeta: Record<
  Route,
  { displayName: string; role?: RouteRole }
> = {
  "/": { displayName: "Beranda" },
  "/sign-in": { displayName: "Masuk" },
  "/dashboard": { displayName: "Dashboard", role: "all" },
  "/dashboard/profile": { displayName: "Profil Saya", role: "all" },
  "/dashboard/settings": { displayName: "Pengaturan", role: "all" },
  "/dashboard/users": { displayName: "Pengguna", role: ["admin"] },
};

export function authorizedRoute(route: Route | null, role?: Role) {
  if (!route || !role) return false;
  const meta = routesMeta[route];
  if (!meta) return false;
  if (!meta.role) return true;
  return meta.role && (meta.role === "all" || meta.role.includes(role));
}

export function normalizeRoute(route?: string | null): Route {
  if (!route) return "/";
  return (route.split("?")[0].replace(/\/+$/, "") as Route) || "/";
}

export function setRouteTitle(title: string) {
  return `${title} | ${appMeta.name}`;
}

export function getRouteTitle(route: Route) {
  return setRouteTitle(routesMeta[route].displayName);
}

export function getMenuByRole(
  currentRole: Role,
  menu: Menu[] = dashboardMenu,
): Menu[] {
  const checkRole = (role?: RouteRole) => {
    if (!role) return true;
    return role === "all" || role?.includes(currentRole);
  };

  const filteredMenu = menu.map(({ section, content }) => {
    const filteredContent = content
      .filter(({ route }) => {
        const meta = routesMeta[route];
        if (!("role" in meta)) return true;
        return checkRole(meta.role);
      })
      .map((item) => {
        if (!item.subMenu) return item;
        const filteredSubMenu = item.subMenu.filter((sm) => checkRole(sm.role));
        if (filteredSubMenu.length <= 0) return null;
        else return { ...item, subMenu: filteredSubMenu };
      });

    if (filteredContent.length <= 0) return null;
    else return { section, content: filteredContent } as Menu;
  });

  return filteredMenu.filter((item) => item !== null);
}

export function getActiveRoute(pathname: string) {
  const allRoutes = Object.keys(routesMeta) as Route[];
  const allMenuRoutes = dashboardMenu.flatMap((m) =>
    m.content.map((c) => c.route),
  );

  const parts = pathname.split("/").filter(Boolean);
  const paths: string[] = [];

  for (let i = parts.length; i > 0; i--)
    paths.push("/" + parts.slice(0, i).join("/"));

  paths.push("/");

  for (const path of paths) {
    const p = path as Route;
    if (allMenuRoutes.includes(p) && allRoutes.includes(p)) return p;
  }
}

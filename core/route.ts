import { appConfig } from "@/config/app";
import { Menu } from "@/config/menu/types";
import { routesConfig } from "@/config/route";
import { Role } from "@/modules/auth/constants";
import { Route } from "next";

export type RouteRole = "all" | Role[];

export function authorizedRoute(route: Route | null, role?: Role) {
  if (!route || !role) return false;
  const meta = routesConfig[route];
  if (!meta) return false;
  if (!meta.role) return true;
  return meta.role && (meta.role === "all" || meta.role.includes(role));
}

export function normalizeRoute(route?: string | null): Route {
  if (!route) return "/";
  return (route.split("?")[0].replace(/\/+$/, "") as Route) || "/";
}

export function setRouteTitle(title: string) {
  return `${title} | ${appConfig.name}`;
}

export function getRouteTitle(route: Route) {
  return setRouteTitle(routesConfig[route].label);
}

export function getRouteHierarchy(path: string): Route[] {
  const parts = path.split("/").filter(Boolean);
  return parts.map((_, i) => "/" + parts.slice(0, i + 1).join("/")) as Route[];
}

export function getActiveRoute(menu: Menu[], pathname: string) {
  const allRoutes = Object.keys(routesConfig) as Route[];
  const allMenuRoutes = menu.flatMap((m) => m.content.map((c) => c.route));

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

export function getMenuByRole(menu: Menu[], currentRole: Role): Menu[] {
  const checkRole = (role?: RouteRole) => {
    if (!role) return true;
    return role === "all" || role?.includes(currentRole);
  };

  const filteredMenu = menu.map(({ section, content }) => {
    const filteredContent = content
      .filter(({ route }) => {
        const meta = routesConfig[route];
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

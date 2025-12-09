import { Role } from "@/modules/auth";
import clsx, { ClassValue } from "clsx";
import { Route } from "next";
import { twMerge } from "tailwind-merge";
import { appMeta, dashboardMenu, Menu, routesMeta } from "../constants";

export function authorized(route: Route | null, role?: string) {
  if (!route || !role) return false;
  const meta = routesMeta[route];
  if (!meta.role) return true;
  return meta.role && (meta.role === "all" || meta.role.includes(role as Role));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function normalizeRoute(route?: string | null): Route {
  if (!route) return "/";
  return (route.replace(/\/+$/, "") as Route) || "/";
}

export function setRouteTitle(title: string) {
  return `${title} | ${appMeta.name}`;
}

export function getRouteTitle(route: Route) {
  return setRouteTitle(routesMeta[route].displayName);
}

export function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getRandomColor(withHash?: boolean) {
  const letters = "0123456789ABCDEF";
  let color = withHash ? "#" : "";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

export function getMenuByRole(
  role: Role,
  menu: Menu[] = dashboardMenu,
): Menu[] {
  const filteredMenu = menu.map(({ section, content }) => {
    const filteredContent = content.filter(({ route }) => {
      const meta = routesMeta[route];
      if (!("role" in meta)) return true;

      const currentRole = meta.role;
      return currentRole === "all" || currentRole?.includes(role);
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

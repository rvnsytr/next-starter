import { Role } from "@/modules/auth";
import clsx, { ClassValue } from "clsx";
import { Route } from "next";
import { twMerge } from "tailwind-merge";
import {
  appMeta,
  dashboardMenu,
  Menu,
  RouteRole,
  routesMeta,
} from "../constants";
import { sharedSchemas } from "../schema.zod";

export function authorizedRoute(route: Route | null, role?: Role) {
  if (!route || !role) return false;
  const meta = routesMeta[route];
  if (!meta) return false;
  if (!meta.role) return true;
  return meta.role && (meta.role === "all" || meta.role.includes(role));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
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

export function getExcelColumnKey(columnNumber: number): string {
  if (columnNumber < 0 || !Number.isInteger(columnNumber)) return "-";

  let result = "";
  let n = columnNumber;

  while (n > 0) {
    n--;
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26);
  }

  return !!result ? result : "-";
}

export type ParseCsvRangeOptions = {
  sort?: "asc" | "desc";
  distinct?: boolean;
  exclude?: number[];
};

const parseCsvRangesSchema = sharedSchemas.number("Baris").int().positive();

export function parseCsvRanges(
  input: string,
  options: ParseCsvRangeOptions = {},
): number[] {
  const { sort, distinct = false, exclude = [] } = options;

  const excludeSet = new Set(exclude);

  const result: number[] = [];
  const tokens = input.split(",");

  for (const token of tokens) {
    const trimmed = token.trim();

    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");

      const start = Number(startStr);
      const end = Number(endStr);

      if (
        parseCsvRangesSchema.safeParse(start).success &&
        parseCsvRangesSchema.safeParse(end).success &&
        start <= end
      ) {
        for (let i = start; i <= end; i++)
          if (!excludeSet.has(i)) result.push(i);
      }

      continue;
    }

    const value = Number(trimmed);
    if (parseCsvRangesSchema.safeParse(value).success && !excludeSet.has(value))
      result.push(value);
  }

  const finalResult = distinct ? Array.from(new Set(result)) : result;
  if (sort) finalResult.sort((a, b) => (sort === "asc" ? a - b : b - a));

  return finalResult;
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

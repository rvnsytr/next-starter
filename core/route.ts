import { appConfig, routeConfig } from "@/shared/config";
import { Role } from "@/shared/permission";
import { Route } from "next";
import { Menu, RouteRole } from "./types";

type NormalizeRouteOptions = {
  /**
   * Include query string and hash fragment.
   *
   * @default false
   *
   * @example
   * normalizeRoute("/users?id=123#profile")
   * // "/users"
   *
   * normalizeRoute("/users?id=123#profile", { withSearch: true })
   * // "/users?id=123#profile"
   */
  withSearch?: boolean;

  /**
   * Collapse repeated slashes into one.
   *
   * @default true
   *
   * @example
   * normalizeRoute("//users///profile")
   * // "/users/profile"
   *
   * normalizeRoute("//users///profile", { collapseSlashes: false })
   * // "//users///profile"
   */
  collapseSlashes?: boolean;

  /**
   * Remove trailing slash, except for root.
   *
   * @default true
   *
   * @example
   * normalizeRoute("/users/")
   * // "/users"
   *
   * normalizeRoute("/users/", { removeTrailingSlash: false })
   * // "/users/"
   */
  removeTrailingSlash?: boolean;

  /**
   * Ensure route starts with a leading slash.
   *
   * @default true
   *
   * @example
   * normalizeRoute("users/profile")
   * // "/users/profile"
   *
   * normalizeRoute("users/profile", { ensureLeadingSlash: false })
   * // "users/profile"
   */
  ensureLeadingSlash?: boolean;
};

/**
 * Normalize a route by applying various transformations.
 *
 * @example
 * normalizeRoute("/users///profile/")
 * // "/users/profile"
 *
 * normalizeRoute("/users#profile?id=123", { withSearch: true })
 * // "/users#profile?id=123"
 */
export function normalizeRoute(
  route?: string | null,
  options?: NormalizeRouteOptions,
) {
  if (!route) return "/";

  let result = route;
  const withSearch = options?.withSearch ?? false;
  const collapseSlashes = options?.collapseSlashes ?? true;
  const removeTrailingSlash = options?.removeTrailingSlash ?? true;
  const ensureLeadingSlash = options?.ensureLeadingSlash ?? true;

  if (!withSearch) result = result.split(/[?#]/)[0];
  if (collapseSlashes) result = result.replace(/\/+/g, "/");
  if (removeTrailingSlash) result = result.replace(/\/+$/, "");
  if (ensureLeadingSlash) result = "/" + result.replace(/^\/+/, "");

  return result || "/";
}

/** Extract request URL components from headers set by the proxy. */
export function getRequestUrl(headers?: Headers) {
  const h = headers ?? new Headers();
  return {
    /**
     * The base path, if the app is deployed under a subpath.
     * @example "/app"
     */
    basePath: h.get("x-nextUrl-basePath"),

    /**
     * The full URL.
     * @example "https://example.com/dashboard/settings?tab=profile#section1"
     */
    href: h.get("x-nextUrl-href"),

    /**
     * The origin.
     * @example "https://example.com"
     */
    origin: h.get("x-nextUrl-origin"),

    /**
     * The hostname.
     * @example "example.com"
     */
    hostname: h.get("x-nextUrl-hostname"),

    /**
     * The pathname.
     * @example "/dashboard/settings"
     */
    pathname: h.get("x-nextUrl-pathname"),

    /**
     * The hash fragment.
     * @example "#section1"
     */
    hash: h.get("x-nextUrl-hash"),

    /**
     * The query string.
     * @example "?tab=profile"
     */
    search: h.get("x-nextUrl-search"),
  };
}

export function authorizedRoute(route: Route | null, role?: Role) {
  if (!route || !role) return false;
  const meta = routeConfig[route];
  if (!meta) return false;
  if (!meta.role) return true;
  return meta.role && (meta.role === "all" || meta.role.includes(role));
}

export function setRouteTitle(title: string) {
  return `${title} | ${appConfig.name}`;
}

export function getRouteTitle(route: Route) {
  return setRouteTitle(routeConfig[route].title);
}

export function getRouteHierarchy(path: string): Route[] {
  const parts = path.split("/").filter(Boolean);
  return parts.map((_, i) => "/" + parts.slice(0, i + 1).join("/")) as Route[];
}

export function getActiveRoute(menu: Menu[], pathname: string) {
  const allRoutes = Object.keys(routeConfig) as Route[];
  const allMenuRoutes = menu.flatMap((m) => m.items.map((c) => c.route));

  const parts = pathname.split("/").filter(Boolean);
  const paths: string[] = [];

  for (let i = parts.length; i > 0; i--)
    paths.push("/" + parts.slice(0, i).join("/"));

  paths.push("/");

  for (const path of paths)
    if (allMenuRoutes.includes(path) && allRoutes.includes(path)) return path;
}

export function getMenuByRole(menu: Menu[], currentRole: Role): Menu[] {
  const checkRole = (role?: RouteRole) => {
    if (!role) return true;
    return role === "all" || role?.includes(currentRole);
  };

  const filteredMenu = menu.map(({ group, items }) => {
    const filteredItems = items
      .filter(({ route }) => {
        const meta = routeConfig[route];
        if (!("role" in meta)) return true;
        return checkRole(meta.role);
      })
      .map((item) => {
        if (!item.subItems) return item;
        const filteredSubItems = item.subItems.filter((si) =>
          checkRole(si.role),
        );
        if (filteredSubItems.length <= 0) return null;
        else return { ...item, subItems: filteredSubItems };
      });

    if (filteredItems.length <= 0) return null;
    else return { group, items: filteredItems } as Menu;
  });

  return filteredMenu.filter((item) => item !== null);
}

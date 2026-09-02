import { appConfig, Menu, RouteAccess, routeConfig } from "@/shared/configs";
import { Role } from "@/shared/permission";
import { Route } from "next";

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
 * normalizeRoute("/dashboard///settings/")
 * // "/dashboard/settings"
 *
 * normalizeRoute("/users?id=123#profile", { withSearch: true })
 * // "/users?id=123#profile"
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

/** Create a sign-in URL with the appropriate callback parameters. */
export function createSignInURL({
  baseUrl = "/sign-in",
  origin,
  pathname,
  hash,
  search,
}: {
  baseUrl?: string;
  origin: string | null;
  pathname: string | null;
  hash: string | null;
  search: string | null;
}): string {
  if (!origin || !pathname) return baseUrl;
  const url = new URL(baseUrl, origin);

  if (!appConfig.default.callbackUrls.includes(pathname as Route))
    url.searchParams.set("callbackURL", `${pathname}${search}${hash}`);

  return url.toString();
}

export function hasAccess(access: RouteAccess, role?: Role) {
  if (access === "public") return true;
  if (!role) return false;
  if (access === "authenticated") return true;
  if (Array.isArray(access)) return access.includes(role);
  return false;
}

export function hasRouteAccess(route: Route, role: Role) {
  if (!route) return false;
  const config = routeConfig[route];
  if (!config) return false;
  return hasAccess(config.access, role);
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

export function getActiveRoute(menu: Menu[], pathname: string): Route | null {
  const allRoutes = Object.keys(routeConfig) as Route[];
  const allMenuRoutes = menu.flatMap((m) => m.items.map((c) => c.route));

  const parts = pathname.split("/").filter(Boolean);
  const paths: string[] = [];

  for (let i = parts.length; i > 0; i--)
    paths.push("/" + parts.slice(0, i).join("/"));

  paths.push("/");

  for (const path of paths) {
    const p = path as Route;
    if (allMenuRoutes.includes(p) && allRoutes.includes(p)) return p;
  }

  return null;
}

export function getAccessibleMenus(menu: Menu[], role: Role): Menu[] {
  return menu
    .map(({ group, items }) => {
      const filteredItems = items
        .filter((item) => hasRouteAccess(item.route, role))
        .map((item) => {
          if (!item.subItems) return item;

          const filteredSubItems = item.subItems.filter((sub) => {
            return hasAccess(sub.access, role);
          });

          if (filteredSubItems.length <= 0) return null;
          else return { ...item, subItems: filteredSubItems };
        })
        .filter((item) => !!item);

      if (filteredItems.length <= 0) return null;
      else return { group, items: filteredItems };
    })
    .filter((item) => !!item);
}

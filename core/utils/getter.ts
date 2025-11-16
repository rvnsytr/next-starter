import { Route } from "next";
import {
  appMeta,
  dashboardMenu,
  Menu,
  RouteRole,
  routesMeta,
} from "../constants";
import { Role } from "../permission";

export function getTitle(route: Route) {
  return `${routesMeta[route].displayName} | ${appMeta.name}`;
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

      const currentRole = meta.role as RouteRole;
      return currentRole === "all" || currentRole.includes(role);
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

  for (const p of paths)
    if (allMenuRoutes.includes(p) && allRoutes.includes(p)) return p;
}

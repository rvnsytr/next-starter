import { Route } from "next";
import { Role } from "./permission";

export type RouteRole = "all" | Role[];
export type RouteMeta = { displayName: string; role?: RouteRole };

export const routesMeta: Record<Route, RouteMeta> = {
  "/": { displayName: "Beranda" },
  "/sign-in": { displayName: "Masuk" },
  "/dashboard": { displayName: "Dashboard", role: "all" },
  "/dashboard/profile": { displayName: "Profil Saya", role: "all" },
  "/dashboard/users": { displayName: "Pengguna", role: ["admin"] },
};

export const signInRoute: Route = "/sign-in";
export const dashboardRoute: Route = "/dashboard";

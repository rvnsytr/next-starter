import { Role } from "@/modules/auth/constants/roles";
import { Route } from "next";

export type RouteAccess = "public" | "authenticated" | Role[];
export type RouteConfig = Record<Route, { title: string; access: RouteAccess }>;

export const ROUTE_CONFIG: RouteConfig = {
  "/": {
    title: "Home",
    access: "public",
  },

  "/sign-in": {
    title: "Sign In",
    access: "public",
  },

  "/dashboard": {
    title: "Dashboard",
    access: "authenticated",
  },

  "/dashboard/profile": {
    title: "My Profile",
    access: "authenticated",
  },

  "/dashboard/settings": {
    title: "Settings",
    access: "authenticated",
  },

  "/dashboard/users": {
    title: "Users",
    access: ["admin"],
  },
};

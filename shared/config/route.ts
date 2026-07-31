import { Role } from "@/shared/permission";
import { Route } from "next";

export type RouteAccess = "public" | "authenticated" | Role[];
export type RouteConfig = Record<Route, { title: string; access: RouteAccess }>;

export const routeConfig: RouteConfig = {
  "/": {
    title: "Beranda",
    access: "public",
  },
  "/sign-in": {
    title: "Masuk",
    access: "public",
  },

  "/dashboard": {
    title: "Dashboard",
    access: "authenticated",
  },
  "/dashboard/profile": {
    title: "Profil Saya",
    access: "authenticated",
  },
  "/dashboard/settings": {
    title: "Pengaturan",
    access: "authenticated",
  },
  "/dashboard/users": {
    title: "Pengguna",
    access: ["admin"],
  },
};

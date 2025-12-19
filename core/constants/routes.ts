import { Role } from "@/modules/auth";
import { Route } from "next";

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

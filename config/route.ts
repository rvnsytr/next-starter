import { RouteRole } from "@/core/route";
import { Route } from "next";

export const routesMeta: Record<Route, { label: string; role?: RouteRole }> = {
  "/": { label: "Beranda" },
  "/sign-in": { label: "Masuk" },

  "/dashboard": { label: "Dashboard", role: "all" },
  "/dashboard/profile": { label: "Profil Saya", role: "all" },
  "/dashboard/settings": { label: "Pengaturan", role: "all" },
  "/dashboard/users": { label: "Pengguna", role: ["admin"] },
};

import { RouteRole } from "@/core/types";
import { Route } from "next";

export const routeConfig: Record<Route, { title: string; role?: RouteRole }> = {
  "/": { title: "Beranda" },
  "/sign-in": { title: "Masuk" },

  "/dashboard": { title: "Dashboard", role: "all" },
  "/dashboard/profile": { title: "Profil Saya", role: "all" },
  "/dashboard/settings": { title: "Pengaturan", role: "all" },
  "/dashboard/users": { title: "Pengguna", role: ["admin"] },
};

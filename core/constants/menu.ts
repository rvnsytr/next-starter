import {
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  LucideIcon,
  Settings,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Route } from "next";
import { LinkProps } from "next/link";
import { RouteRole } from "./routes";

type MenuContent = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;

  // if href is not defined, the Link href prop will be `/{route}/#${toKebab(displayName)}`
  subMenu?: {
    displayName: string;
    href?: LinkProps["href"];
    variant?: "default" | "destructive";
    disabled?: boolean;
    role?: RouteRole;
  }[];
};

export type Menu = { section: string; content: MenuContent[] };

export const dashboardMenu: Menu[] = [
  {
    section: "Umum",
    content: [
      { route: "/dashboard", icon: LayoutDashboard },
      { route: "/dashboard/users", icon: UsersRound },
    ],
  },
  {
    section: "Lainnya",
    content: [
      {
        route: "/dashboard/profile",
        icon: UserRound,
        subMenu: [{ displayName: "Informasi Pribadi" }],
      },
      {
        route: "/dashboard/settings",
        icon: Settings,
        subMenu: [
          { displayName: "Tema" },
          { displayName: "Layout" },
          { displayName: "Sesi Aktif" },
          { displayName: "Ubah Kata Sandi" },
        ],
      },
    ],
  },
];

export const dashboardfooterMenu: (MenuContent & { displayName: string })[] = [
  { route: "/", displayName: "Beranda", icon: ExternalLink },
  { route: "/help", displayName: "Bantuan", icon: CircleHelp, disabled: true },
];

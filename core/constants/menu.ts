import {
  CircleHelpIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  LucideIcon,
  SettingsIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Route } from "next";
import { LinkProps } from "next/link";
import { RouteRole } from "./routes";

type MenuContent = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;

  // if href is not defined, the Link href prop will be `/{route}/#${toCase(displayName, "slug")}`
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
      { route: "/dashboard", icon: LayoutDashboardIcon },
      { route: "/dashboard/users", icon: UsersRoundIcon },
    ],
  },
  {
    section: "Lainnya",
    content: [
      {
        route: "/dashboard/profile",
        icon: UserRoundIcon,
        subMenu: [{ displayName: "Informasi Pribadi" }],
      },
      {
        route: "/dashboard/settings",
        icon: SettingsIcon,
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
  { route: "/", displayName: "Beranda", icon: ExternalLinkIcon },
  {
    route: "/help",
    displayName: "Bantuan",
    icon: CircleHelpIcon,
    disabled: true,
  },
];

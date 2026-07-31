import { Hotkey } from "@tanstack/react-hotkeys";
import {
  ExternalLinkIcon,
  LayoutDashboardIcon,
  LucideIcon,
  SettingsIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Route } from "next";
import { RouteAccess } from "./config";

export type Menu = { group: string; items: MenuItem[] };

export type MenuItem = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;
  shortcut?: Hotkey;

  subItems?: {
    label: string;
    access: RouteAccess;
    /** if href is not defined, the Link href prop will be `/${route}#${toCase(label, "kebab")}` */
    href?: Route;
    disabled?: boolean;
  }[];
};

export const menuConfig = {
  dashboard: [
    {
      group: "Umum",
      items: [
        { route: "/dashboard", icon: LayoutDashboardIcon },
        { route: "/dashboard/users", icon: UsersRoundIcon },
      ],
    },
    {
      group: "Lainnya",
      items: [
        {
          route: "/dashboard/profile",
          icon: UserRoundIcon,
          subItems: [{ label: "Informasi Pribadi" }],
        },
        {
          route: "/dashboard/settings",
          icon: SettingsIcon,
          subItems: [
            { label: "Tema" },
            { label: "Sesi Aktif" },
            { label: "Ubah Kata Sandi" },
          ],
        },
      ],
    },
  ] as Menu[],

  "dashboard-footer": [
    { route: "/", icon: ExternalLinkIcon },
    // { route: "/about", icon: ExternalLinkIcon }
  ] as Omit<MenuItem, "subItems">[],
} satisfies Record<string, Menu[] | MenuItem[]>;

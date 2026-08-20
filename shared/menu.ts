import { HotkeySequence } from "@tanstack/react-hotkeys";
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
  shortcut?: HotkeySequence;

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
      group: "General",
      items: [
        { route: "/dashboard", icon: LayoutDashboardIcon },
        { route: "/dashboard/users", icon: UsersRoundIcon },
      ],
    },
    {
      group: "Others",
      items: [
        {
          route: "/dashboard/profile",
          icon: UserRoundIcon,
          subItems: [{ label: "Personal Information" }],
        },
        {
          route: "/dashboard/settings",
          icon: SettingsIcon,
          subItems: [
            { label: "Theme" },
            { label: "Active Sessions" },
            { label: "Change Password" },
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

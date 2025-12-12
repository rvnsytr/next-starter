import {
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  LucideIcon,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Route } from "next";
import { LinkProps } from "next/link";

type MenuContent = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;

  // if href is not defined, the Link href prop will be `/{route}/#${toKebab(displayName)}`
  subMenu?: {
    displayName: string;
    href?: LinkProps["href"];
    variant?: "default" | "destructive";
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
    section: "Pengaturan",
    content: [
      {
        route: "/dashboard/profile",
        icon: UserRound,
        subMenu: [
          { displayName: "Informasi Pribadi" },
          { displayName: "Ubah Kata Sandi" },
          { displayName: "Sesi Aktif" },
        ],
      },
    ],
  },
];

export const dashboardfooterMenu: (MenuContent & { displayName: string })[] = [
  { route: "/", displayName: "Beranda", icon: ExternalLink },
  { route: "/help", displayName: "Bantuan", icon: CircleHelp, disabled: true },
];

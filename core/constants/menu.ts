import { IconOrText } from "@/core/components/ui/icons";
import {
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Route } from "next";
import { LinkProps } from "next/link";

type MenuContent = {
  route: Route;
  icon?: IconOrText;
  disabled?: boolean;

  // if href is not defined, the Link href prop will be `/{route}/#${toKebabCase(label)}`
  subMenu?: {
    label: string;
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
          { label: "Informasi Pribadi" },
          { label: "Ubah Kata Sandi" },
          { label: "Sesi Aktif" },
          { label: "Hapus Akun", variant: "destructive" },
        ],
      },
    ],
  },
];

export const dashboardfooterMenu: (Omit<MenuContent, "route" | "subMenu"> & {
  url: Route;
  displayName: string;
})[] = [
  { url: "/", displayName: "Beranda", icon: ExternalLink },
  { url: "/help", displayName: "Bantuan", icon: CircleHelp, disabled: true },
];

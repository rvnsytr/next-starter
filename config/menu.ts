import { Menu, MenuContent } from "@/core/constants/menu";
import {
  CircleHelpIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";

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
        subMenu: [{ label: "Informasi Pribadi" }],
      },
      {
        route: "/dashboard/settings",
        icon: SettingsIcon,
        subMenu: [
          { label: "Tema" },
          { label: "Layout" },
          { label: "Sesi Aktif" },
          { label: "Ubah Kata Sandi" },
        ],
      },
    ],
  },
];

export const dashboardfooterMenu: (MenuContent & { label: string })[] = [
  { route: "/", label: "Beranda", icon: ExternalLinkIcon },
  {
    route: "/help",
    label: "Bantuan",
    icon: CircleHelpIcon,
    disabled: true,
  },
];

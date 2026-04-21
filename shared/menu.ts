import { Menu, MenuItem } from "@/core/types";
import {
  CircleHelpIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";

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
            { label: "Layout" },
            { label: "Sesi Aktif" },
            { label: "Ubah Kata Sandi" },
          ],
        },
      ],
    },
  ],
} satisfies Record<string, Menu[]>;

export const dashboardfooterMenu: (MenuItem & { label: string })[] = [
  { route: "/", label: "Beranda", icon: ExternalLinkIcon },
  {
    route: "/help",
    label: "Bantuan",
    icon: CircleHelpIcon,
    disabled: true,
  },
];

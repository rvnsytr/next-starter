import { Menu, MenuItem } from "@/core/types";
import {
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
  ] as Menu[],

  "dashboard-footer": [
    { route: "/", icon: ExternalLinkIcon },
    // { route: "/about", icon: ExternalLinkIcon }
  ] as Omit<MenuItem, "subItems">[],
} satisfies Record<string, Menu[] | MenuItem[]>;

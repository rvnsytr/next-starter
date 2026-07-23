import { LucideIcon, ShieldUserIcon, UserRoundIcon } from "lucide-react";

export type Role = keyof typeof roles.meta;

export const roles = {
  get default(): Role {
    return "user" satisfies Role;
  },

  get values(): Role[] {
    return Object.keys(this.meta) as Role[];
  },

  meta: {
    user: {
      label: "Pengguna",
      icon: UserRoundIcon,
      description: "Pengguna standar dengan akses dan izin dasar.",
      color: "var(--primary)",
    },
    admin: {
      label: "Admin",
      icon: ShieldUserIcon,
      description:
        "Administrator dengan akses penuh dan kontrol pengelolaan sistem.",
      color: "var(--color-cyan-500)",
    },
  } satisfies Record<
    string,
    { label: string; description: string; icon: LucideIcon; color: string }
  >,
};

export const roleConfig: Record<
  Role,
  { label: string; description: string; icon: LucideIcon; color: string }
> = {
  user: {
    label: "Pengguna",
    icon: UserRoundIcon,
    description: "Pengguna standar dengan akses dan izin dasar.",
    color: "var(--primary)",
  },
  admin: {
    label: "Admin",
    icon: ShieldUserIcon,
    description:
      "Administrator dengan akses penuh dan kontrol pengelolaan sistem.",
    color: "var(--color-cyan-500)",
  },
};

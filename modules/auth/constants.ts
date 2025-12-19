import { auth } from "@/core/auth";
import { roles } from "@/core/permission";
import {
  Ban,
  CircleDot,
  LucideIcon,
  ShieldUser,
  UserRound,
} from "lucide-react";

export type AuthSession = typeof auth.$Infer.Session;

export type Role = keyof typeof roles;
export type UserStatus = (typeof allUserStatus)[number];

export const allRoles = Object.keys(roles) as Role[];
export const defaultRole: Role = "user";

export const allUserStatus = ["active", "banned"] as const;

export const rolesMeta: Record<
  Role,
  { displayName: string; desc: string; icon: LucideIcon; color: string }
> = {
  user: {
    displayName: "Pengguna",
    icon: UserRound,
    desc: "Pengguna standar dengan akses dan izin dasar.",
    color: "var(--primary)",
  },
  admin: {
    displayName: "Admin",
    icon: ShieldUser,
    desc: "Administrator dengan akses penuh dan kontrol pengelolaan sistem.",
    color: "var(--rvns)",
  },
};

export const userStatusMeta: Record<
  UserStatus,
  { displayName: string; desc: string; icon: LucideIcon; color: string }
> = {
  active: {
    displayName: "Aktif",
    desc: "Pengguna aktif dan dapat diakses",
    icon: CircleDot,
    color: "var(--success)",
  },
  banned: {
    displayName: "Nonaktif",
    desc: "Pengguna diblokir dan tidak dapat mengakses sistem",
    icon: Ban,
    color: "var(--destructive)",
  },
};

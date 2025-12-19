import { auth } from "@/core/auth";
import { roles } from "@/core/permission";
import { LucideIcon, ShieldUser, UserRound } from "lucide-react";

export type AuthSession = typeof auth.$Infer.Session;
export type Role = keyof typeof roles;

export const allRoles = Object.keys(roles) as Role[];
export const defaultRole: Role = "user";

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

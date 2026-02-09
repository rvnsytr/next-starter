import { auth } from "@/core/auth";
import {
  BanIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CircleXIcon,
  LucideIcon,
  ShieldUserIcon,
  UserRoundIcon,
} from "lucide-react";

export type AuthSession = typeof auth.$Infer.Session;

export type Role = (typeof allRoles)[number];
export const allRoles = ["user", "admin"] as const;

export const defaultRole: Role = "user";

export const rolesMeta: Record<
  Role,
  { displayName: string; description: string; icon: LucideIcon; color: string }
> = {
  user: {
    displayName: "Pengguna",
    icon: UserRoundIcon,
    description: "Pengguna standar dengan akses dan izin dasar.",
    color: "var(--primary)",
  },
  admin: {
    displayName: "Admin",
    icon: ShieldUserIcon,
    description:
      "Administrator dengan akses penuh dan kontrol pengelolaan sistem.",
    color: "var(--color-cyan-500)",
  },
};

export type UserStatus = (typeof allUserStatus)[number];
export const allUserStatus = [
  "verified",
  "active",
  "nonactive",
  "banned",
] as const;
export const userStatusMeta: Record<
  UserStatus,
  { displayName: string; description: string; icon: LucideIcon; color: string }
> = {
  verified: {
    displayName: "Terverifikasi",
    description: "Pengguna terverifikasi dan dapat mengakses sistem.",
    icon: CircleCheckIcon,
    color: "var(--success)",
  },
  active: {
    displayName: "Aktif",
    description: "Pengguna telah melakukan aktivasi dan menunggu verifikasi.",
    icon: CircleDotIcon,
    color: "var(--primary)",
  },
  nonactive: {
    displayName: "Nonaktif",
    description:
      "Pengguna belum melakukan aktivasi dan belum memiliki akses ke sistem.",
    icon: CircleXIcon,
    color: "var(--muted-foreground)",
  },
  banned: {
    displayName: "Diblokir",
    description: "Pengguna diblokir dan tidak dapat mengakses sistem.",
    icon: BanIcon,
    color: "var(--destructive)",
  },
};

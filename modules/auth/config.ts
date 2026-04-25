import { AuthSession } from "@/core/auth";
import { Role } from "@/shared/permission";
import {
  BanIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CircleXIcon,
  LucideIcon,
  ShieldUserIcon,
  UserRoundIcon,
} from "lucide-react";

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

export type UserStatus = (typeof allUserStatus)[number];
export const allUserStatus = [
  "verified",
  "active",
  "nonactive",
  "banned",
] as const;
export const userStatusConfig: Record<
  UserStatus,
  { label: string; description: string; icon: LucideIcon; color: string }
> = {
  verified: {
    label: "Terverifikasi",
    description: "Pengguna terverifikasi dan dapat mengakses sistem.",
    icon: CircleCheckIcon,
    color: "var(--success)",
  },
  active: {
    label: "Aktif",
    description: "Pengguna telah melakukan aktivasi dan menunggu verifikasi.",
    icon: CircleDotIcon,
    color: "var(--primary)",
  },
  nonactive: {
    label: "Nonaktif",
    description:
      "Pengguna belum melakukan aktivasi dan belum memiliki akses ke sistem.",
    icon: CircleXIcon,
    color: "var(--muted-foreground)",
  },
  banned: {
    label: "Diblokir",
    description: "Pengguna diblokir dan tidak dapat mengakses sistem.",
    icon: BanIcon,
    color: "var(--destructive)",
  },
};

export function getUserStatus(
  data: Pick<AuthSession["user"], "email" | "emailVerified" | "banned">,
): UserStatus {
  if (data.banned) return "banned";
  if (data.emailVerified) return "verified";
  return "active";
}

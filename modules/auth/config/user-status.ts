import { User } from "@/core/auth";
import {
  BanIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CircleXIcon,
  LucideIcon,
} from "lucide-react";

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
  data: Pick<User, "email" | "emailVerified" | "banned">,
): UserStatus {
  if (data.banned) return "banned";
  if (data.emailVerified) return "verified";
  return "active";
}

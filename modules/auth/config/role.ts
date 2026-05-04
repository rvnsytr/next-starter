import { Role } from "@/shared/permission";
import { LucideIcon, ShieldUserIcon, UserRoundIcon } from "lucide-react";

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

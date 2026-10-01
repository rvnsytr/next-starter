import { LucideIcon, ShieldUserIcon, UserRoundIcon } from "lucide-react";
import { Role } from "./roles";

export const ROLE_META: Record<
  Role,
  { label: string; description: string; icon: LucideIcon; color: string }
> = {
  user: {
    label: "User",
    icon: UserRoundIcon,
    description: "Standard user with basic access and permissions.",
    color: "var(--primary)",
  },
  admin: {
    label: "Admin",
    icon: ShieldUserIcon,
    description:
      "Administrator with full access and full control of the system.",
    color: "var(--color-cyan-500)",
  },
};

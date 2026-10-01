import {
  BanIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CircleXIcon,
  LucideIcon,
} from "lucide-react";
import { UserStatus } from "./user-status";

export const USER_STATUS_META: Record<
  UserStatus,
  { label: string; description: string; icon: LucideIcon; color: string }
> = {
  verified: {
    label: "Verified",
    description: "Verified user with access to the system.",
    icon: CircleCheckIcon,
    color: "var(--success)",
  },
  active: {
    label: "Active",
    description:
      "User has activated their account and is awaiting verification.",
    icon: CircleDotIcon,
    color: "var(--primary)",
  },
  nonactive: {
    label: "Inactive",
    description:
      "User has not activated their account and has no access to the system.",
    icon: CircleXIcon,
    color: "var(--muted-foreground)",
  },
  banned: {
    label: "Banned",
    description: "User is banned and cannot access the system.",
    icon: BanIcon,
    color: "var(--destructive)",
  },
};

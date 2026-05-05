import { LucideIcon, MarsIcon, VenusIcon } from "lucide-react";

export type Gender = (typeof genders)[number];
export const genders = ["m", "f"] as const;
export const genderConfig: Record<
  Gender,
  { displayName: string; icon: LucideIcon; color: string }
> = {
  m: {
    displayName: "Laki-laki",
    icon: MarsIcon,
    color: "var(--color-sky-500)",
  },
  f: {
    displayName: "Perempuan",
    icon: VenusIcon,
    color: "var(--color-pink-500)",
  },
};

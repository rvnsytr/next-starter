import { LucideIcon, MarsIcon, VenusIcon } from "lucide-react";

export type Gender = (typeof GENDERS)[number];

export const GENDERS = ["m", "f"] as const;

export const GENDER_META: Record<
  Gender,
  {
    label: string;
    icon: LucideIcon;
    color: string;
  }
> = {
  m: {
    label: "Laki-laki",
    icon: MarsIcon,
    color: "var(--color-sky-500)",
  },
  f: {
    label: "Perempuan",
    icon: VenusIcon,
    color: "var(--color-pink-500)",
  },
};

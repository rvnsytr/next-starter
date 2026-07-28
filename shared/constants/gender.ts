import { LucideIcon, MarsIcon, VenusIcon } from "lucide-react";

export type Gender = (typeof values)[number];

const values = ["m", "f"] as const;

const meta: Record<
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

export const genders = {
  values,
  meta,
};

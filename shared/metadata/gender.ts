import { LucideIcon, MarsIcon, VenusIcon } from "lucide-react";

export type Gender = "m" | "f";

export const genders = {
  get values(): Gender[] {
    return Object.keys(this.meta) as Gender[];
  },

  get meta(): Record<
    Gender,
    {
      label: string;
      icon: LucideIcon;
      color: string;
    }
  > {
    return {
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
  },
};

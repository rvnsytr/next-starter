import { LucideIcon, MarsIcon, VenusIcon } from "lucide-react";

export const appConfig = {
  name: "Next Starter",
  description: "App description...",
  keywords: ["next", "next starter"],

  defaultLanguage: "id",

  logo: {
    default: "/logo.png",
    withText: "/logo-text.png",
  },
};

export type Gender = (typeof allGenders)[number];
export const allGenders = ["m", "f"] as const;
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

export type Language = (typeof allLanguages)[number];
export const allLanguages = ["en", "id", "es", "fr", "de", "ar"] as const;
export const languageConfig: Record<
  Language,
  { locale: string; currency: string; decimal: number; symbol: string }
> = {
  en: { locale: "en-US", currency: "USD", decimal: 2, symbol: "$" },
  id: { locale: "id-ID", currency: "IDR", decimal: 0, symbol: "Rp" },
  de: { locale: "de-DE", currency: "EUR", decimal: 2, symbol: "€" },
  es: { locale: "es-ES", currency: "EUR", decimal: 2, symbol: "€" },
  fr: { locale: "fr-FR", currency: "EUR", decimal: 2, symbol: "€" },
  ar: { locale: "ar-SA", currency: "SAR", decimal: 2, symbol: "ر.س" },
};

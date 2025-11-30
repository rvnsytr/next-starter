import { LucideIcon, Mars, Venus } from "lucide-react";

export const allGenders = ["m", "f"] as const;
export type Gender = (typeof allGenders)[number];
export const genderMeta: Record<
  Gender,
  { displayName: string; icon: LucideIcon; color: string }
> = {
  m: { displayName: "Laki-laki", icon: Mars, color: "var(--color-sky-500)" },
  f: { displayName: "Perempuan", icon: Venus, color: "var(--color-pink-500)" },
};

export const allLanguages = ["en", "id", "es", "fr", "de", "ar"] as const;
export type Language = (typeof allLanguages)[number];
export const languageMeta: Record<
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

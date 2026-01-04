import {
  FrameIcon,
  LucideIcon,
  MarsIcon,
  MinimizeIcon,
  MonitorIcon,
  MoonIcon,
  ScanIcon,
  SunIcon,
  VenusIcon,
} from "lucide-react";

export type ActionResponse<TData> =
  | {
      success: true;
      count: { total: number } & Record<string, number>;
      data: TData;
    }
  | { success: false; error: string };

export const allRequestMetaKey = [
  "basePath",
  "href",
  "origin",
  "hostname",
  "pathname",
  "hash",
  "search",
] as const;
export type RequestMetaKey = (typeof allRequestMetaKey)[number];

export const allThemes = ["light", "system", "dark"] as const;
export type Theme = (typeof allThemes)[number];

export const themeMeta: Record<Theme, { icon: LucideIcon }> = {
  light: { icon: SunIcon },
  system: { icon: MonitorIcon },
  dark: { icon: MoonIcon },
};

export const allLayoutMode = ["fullwidth", "centered", "unset"] as const;
export type LayoutMode = (typeof allLayoutMode)[number];

export const defaultLayout: LayoutMode = "centered";

export const layoutModeMeta: Record<
  LayoutMode,
  { displayName: string; icon: LucideIcon }
> = {
  fullwidth: { displayName: "Fullwidth", icon: ScanIcon },
  centered: { displayName: "Centered", icon: MinimizeIcon },
  unset: { displayName: "Unset", icon: FrameIcon },
};

export const allGenders = ["m", "f"] as const;
export type Gender = (typeof allGenders)[number];
export const genderMeta: Record<
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

import { LucideIcon, MarsIcon, VenusIcon } from "lucide-react";

export type ActionResponse<TData> =
  | {
      success: true;
      count?: { total: number } & Record<string, number>;
      data: TData;
    }
  | { success: false; error: string };

export type StringCase =
  | "slug"
  | "snake"
  | "camel"
  | "pascal"
  | "constant"
  | "title";

export type SnakeToCamel<S extends string> = S extends `${infer H}_${infer T}`
  ? `${H}${Capitalize<SnakeToCamel<T>>}`
  : S;

export type Camelize<T> = T extends readonly (infer U)[]
  ? readonly Camelize<U>[]
  : T extends (infer U)[]
    ? Camelize<U>[]
    : T extends object
      ? {
          [K in keyof T as K extends string ? SnakeToCamel<K> : K]: Camelize<
            T[K]
          >;
        }
      : T;

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

export const allGenders = ["l", "p"] as const;
export type Gender = (typeof allGenders)[number];
export const genderMeta: Record<
  Gender,
  { displayName: string; icon: LucideIcon; color: string }
> = {
  l: {
    displayName: "Laki-laki",
    icon: MarsIcon,
    color: "var(--color-sky-500)",
  },
  p: {
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

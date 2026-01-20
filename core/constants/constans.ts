import { LucideIcon, MarsIcon, VenusIcon } from "lucide-react";

export type Override<T, U> = Omit<T, keyof U> & U;

export type ActionResponse<TData> = {
  count?: { total: number } & Record<string, number>;
} & ({ success: true; data: TData } | { success: false; error: string });

export type StringCase =
  | "kebab"
  | "snake"
  | "camel"
  | "pascal"
  | "constant"
  | "title";

export type TransformableStringCase = Extract<
  StringCase,
  "kebab" | "snake" | "camel"
>;

export type KebabCase<S extends string> =
  SnakeCase<S> extends `${infer A}_${infer B}`
    ? `${A}-${KebabCase<B>}`
    : SnakeCase<S>;

export type CamelCase<S extends string> = S extends `${infer A}_${infer B}`
  ? `${A}${Capitalize<CamelCase<B>>}`
  : S;

export type SnakeCase<S extends string> = S extends `${infer A}${infer B}`
  ? B extends Uncapitalize<B>
    ? `${Lowercase<A>}${SnakeCase<B>}`
    : `${Lowercase<A>}_${SnakeCase<B>}`
  : S;

export type TransformKeys<
  T,
  C extends TransformableStringCase,
> = T extends readonly (infer U)[]
  ? readonly TransformKeys<U, C>[]
  : T extends Date | RegExp
    ? T
    : T extends object
      ? {
          [K in keyof T as K extends string
            ? C extends "kebab"
              ? KebabCase<K>
              : C extends "snake"
                ? SnakeCase<K>
                : CamelCase<K>
            : K]: TransformKeys<T[K], C>;
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

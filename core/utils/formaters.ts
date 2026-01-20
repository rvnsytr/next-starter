import { ZodError } from "zod";
import {
  appMeta,
  Language,
  languageMeta,
  StringCase,
  TransformableStringCase,
  TransformKeys,
} from "../constants";

export function capitalize(string: string, mode: "all" | "first" = "all") {
  const handler = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  if (mode === "first") return handler(string);
  return string.split(" ").map(handler).join(" ");
}

export function toBytes(mb: number) {
  return mb * 1024 * 1024;
}

export function toMegabytes(bytes: number) {
  return bytes / 1024 / 1024;
}

export function sanitizeNumber(str: string): number {
  const normalized = str
    .replace(/\u0660/g, "0")
    .replace(/\u0661/g, "1")
    .replace(/\u0662/g, "2")
    .replace(/\u0663/g, "3")
    .replace(/\u0664/g, "4")
    .replace(/\u0665/g, "5")
    .replace(/\u0666/g, "6")
    .replace(/\u0667/g, "7")
    .replace(/\u0668/g, "8")
    .replace(/\u0669/g, "9");
  return Number(normalized.replace(/[^\d]/g, "") || "0");
}

export function normalizeString(str: string) {
  return str
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function toCase(str: string, mode: StringCase) {
  const base = normalizeString(str);

  switch (mode) {
    case "kebab":
      return base.replace(/\s+/g, "-");
    case "snake":
      return base.replace(/\s+/g, "_");
    case "camel":
      return base
        .replace(/\s+(\w)/g, (_, c) => c.toUpperCase())
        .replace(/^\w/, (c) => c.toLowerCase());
    case "pascal":
      return base.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s+/g, "");
    case "constant":
      return base.replace(/\s+/g, "_").toUpperCase();
    case "title":
      return base.replace(/\b\w/g, (c) => c.toUpperCase());
    default:
      return base;
  }
}

export function fromCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .trim();
}

export function transformKeys<T, C extends TransformableStringCase>(
  value: T,
  keyCase: C,
): TransformKeys<T, C> {
  const transform = (val: unknown): unknown => {
    if (Array.isArray(val)) return val.map(transform);

    if (
      val === null ||
      typeof val !== "object" ||
      val instanceof Date ||
      val instanceof RegExp
    )
      return val;

    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [toCase(k, keyCase), transform(v)]),
    );
  };

  return transform(value) as TransformKeys<T, C>;
}

export function formatNumber(
  number: number,
  props?: { lang?: Language; options?: Intl.NumberFormatOptions },
) {
  const locale = languageMeta[props?.lang ?? (appMeta.lang as Language)].locale;
  const value = new Intl.NumberFormat(locale, props?.options).format(number);
  return value === "0" ? "0" : value;
}

export function formatPhone(number: string | number, prefix?: "+62" | "0") {
  const phoneStr = String(number);
  if (!phoneStr || phoneStr === "0") return "";
  if (phoneStr.length <= 3) return phoneStr;

  let formatted = phoneStr.slice(0, 3);
  let remaining = phoneStr.slice(3);
  while (remaining.length > 0) {
    formatted += "-" + remaining.slice(0, 4);
    remaining = remaining.slice(4);
  }

  return `${prefix ?? ""} ${formatted}`.trim();
}

export function formatZodError<T>(zodError: ZodError<T>): string {
  return JSON.parse(zodError.message)[0].message;
}

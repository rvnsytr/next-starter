import { appMeta, Language, languageMeta } from "../constants";

export function capitalize(string: string, mode: "word" | "first" = "word") {
  const handler = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  if (mode === "first") return handler(string);
  return string.split(" ").map(handler).join(" ");
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

export function toBytes(mb: number) {
  return mb * 1024 * 1024;
}

export function toMegabytes(bytes: number) {
  return bytes / 1024 / 1024;
}

export function toKebabCase(str: string) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

export function kebabToRegularCase(str: string) {
  return str.trim().split("-").join(" ");
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

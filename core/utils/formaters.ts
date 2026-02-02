import z, { ZodError } from "zod";
import { appMeta } from "../constants/app";
import { Language, languageMeta } from "../constants/metadata";
import {
  StringCase,
  TransformableStringCase,
  TransformKeys,
} from "../constants/types";

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

export function formatZodError<T>(
  zodError: ZodError<T>,
  withPath = false,
): string {
  const error = JSON.parse(zodError.message)[0];
  if (withPath) return `${error.path}: ${error.message}`;
  return error.message;
}

export type FormatCsvRangeOptions = {
  sort?: "asc" | "desc";
  distinct?: boolean;
  exclude?: number[];
};

const formatCsvRangeSchema = z.coerce.number().int().positive();

export function formatCsvRange(input: string, options?: FormatCsvRangeOptions) {
  const excludeSet = new Set(options?.exclude ?? []);

  const result: number[] = [];
  const tokens = input.split(",");

  for (const token of tokens) {
    const trimmed = token.trim();

    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");

      const start = Number(startStr);
      const end = Number(endStr);

      if (
        formatCsvRangeSchema.safeParse(start).success &&
        formatCsvRangeSchema.safeParse(end).success &&
        start <= end
      ) {
        for (let i = start; i <= end; i++)
          if (!excludeSet.has(i)) result.push(i);
      }

      continue;
    }

    const value = Number(trimmed);
    if (formatCsvRangeSchema.safeParse(value).success && !excludeSet.has(value))
      result.push(value);
  }

  const finalResult = options?.distinct ? Array.from(new Set(result)) : result;
  if (options?.sort)
    finalResult.sort((a, b) => (options.sort === "asc" ? a - b : b - a));

  return finalResult;
}

export function formatNumberRange(nums: number[], minRangeSize = 10) {
  if (!nums.length) return [];

  const result: string[] = [];
  let start = nums[0];
  let prev = nums[0];

  for (let i = 1; i <= nums.length; i++) {
    const curr = nums[i];

    if (curr === prev + 1) {
      prev = curr;
      continue;
    }

    const length = prev - start + 1;
    if (length >= minRangeSize) result.push(`${start}-${prev}`);
    else for (let n = start; n <= prev; n++) result.push(String(n));

    start = curr;
    prev = curr;
  }

  return result;
}

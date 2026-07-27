import { appConfig } from "@/shared/config";
import { Language, languages } from "@/shared/metadata";

export function toBytes(mb: number) {
  return mb * 1024 * 1024;
}

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

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

export function formatNumber(
  number: number,
  options?: Intl.NumberFormatOptions & { lang?: Language },
) {
  const config =
    languages.meta[options?.lang ?? (appConfig.default.language as Language)];
  const value = new Intl.NumberFormat(config.locale, options).format(number);
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

export function formatNumberRange(nums: number[], minRangeSize = 10) {
  if (!nums.length) return [];

  const result: string[] = [];
  let start = nums[0]!;
  let prev = nums[0]!;

  for (let i = 1; i <= nums.length; i++) {
    const curr = nums[i]!;

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

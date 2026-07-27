import { StringCase, TransformableStringCase, TransformKeys } from "../types";

export function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));

  return result;
}

export function getRandomColor(withHash?: boolean) {
  const letters = "0123456789ABCDEF";
  let color = withHash ? "#" : "";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

export function capitalize(string: string, mode: "all" | "first" = "all") {
  const handler = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  if (mode === "first") return handler(string);
  return string.split(" ").map(handler).join(" ");
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

export function fromCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .trim();
}

export function toCase(
  str: string,
  mode: StringCase,
  options?: { normalize?: boolean },
) {
  const normalize = options?.normalize ?? true;

  const base = normalize ? normalizeString(str) : str;

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

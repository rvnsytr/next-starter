import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileMetadata } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

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

export function getExcelColumnKey(columnNumber: number): string {
  if (columnNumber < 0 || !Number.isInteger(columnNumber)) return "-";

  let result = "";
  let n = columnNumber;

  while (n > 0) {
    n--;
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26);
  }

  return !!result ? result : "-";
}

export function getFileInfo(file: File | FileMetadata) {
  return {
    name: file.name,
    size: file.size,
    type: file.type ?? "",
    extension: `.${file.name.split(".").pop()}`,
  };
}

export function getClientCookie(name: string) {
  if (!document?.cookie) return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

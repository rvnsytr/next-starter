import { messages } from "@/shared/messages";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";
import { ActionError, ActionResponse } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function isValidUrl(url: string) {
  return z.url().safeParse(url).success;
}

export function validateValue<T>(
  value: unknown,
  schema: z.ZodType<T>,
): ActionResponse<T> {
  const success = false;
  const res = schema.safeParse(value);

  if (!res.success) {
    const error = formatZodError(res.error);
    return { success, message: error.message, error };
  }

  return { success: true, data: res.data };
}

export function formatZodError<T>(
  zodError: z.ZodError<T>,
  options?: { withPath?: boolean },
): ActionError {
  const success = false;
  const error = z.treeifyError(zodError);

  if (!zodError.issues.length)
    return { success, message: messages.error, error };

  const firstIssue = zodError.issues[0];
  let message = firstIssue?.message ?? "Validation error";

  if (options?.withPath && firstIssue?.path.length) {
    const paths = firstIssue.path.filter(Boolean);
    message = `[${paths.join(".")}] ${firstIssue.message}`;
  }

  return { success, message, error };
}

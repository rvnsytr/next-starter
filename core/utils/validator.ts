import { messages } from "@/shared/messages";
import z from "zod";
import { ActionError, ActionResponse } from "../types";

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

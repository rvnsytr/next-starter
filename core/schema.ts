import { allGenders } from "@/shared/config";
import z from "zod";
import { FileType, fileTypeConfig } from "./config/file-type";
import { messages } from "./messages";

export const sharedSchemas = {
  string: (options?: {
    label?: string;
    min?: number;
    max?: number;
    sanitize?: boolean;
    withRequired?: boolean;
  }) => {
    const { invalid, required } = messages;
    const { tooShort, tooLong } = messages.string;

    const label = options?.label ?? undefined;
    const min = options?.min ?? 0;
    const max = options?.max ?? 0;
    const sanitize = options?.sanitize ?? true;
    const withRequired = options?.withRequired ?? false;

    const invalidError = label && invalid(label);
    let schema = z.string({ error: invalidError }).trim();

    if (sanitize)
      schema = schema.regex(/^$|[A-Za-z0-9]/, { message: invalidError });

    if (min > 0) {
      const error =
        label && (min <= 1 && withRequired ? required : tooShort)(label, min);
      schema = schema.min(min, { error });
    }

    if (max > 0) {
      const error = label && tooLong(label, max);
      schema = schema.max(max, { error });
    }

    return schema;
  },

  number: (options?: {
    label?: string;
    min?: number;
    max?: number;
    withRequired?: boolean;
  }) => {
    const { invalid, required } = messages;
    const { tooSmall, tooLarge } = messages.number;

    const label = options?.label ?? undefined;
    const min = options?.min ?? 0;
    const max = options?.max ?? 0;
    const withRequired = options?.withRequired ?? true;

    const invalidError = label && invalid(label);
    let schema = z.number({ error: invalidError });

    if (min > 0) {
      const error =
        label && (min <= 1 && withRequired ? required : tooSmall)(label, min);
      schema = schema.min(min, { error });
    }

    if (max > 0) {
      const error = label && tooLarge(label, max);
      schema = schema.max(max, { error });
    }

    return schema;
  },

  boolean: (label?: string) => {
    const error = label ? messages.invalid(label) : undefined;
    return z
      .union([z.boolean(), z.string()], { error })
      .transform((v) =>
        typeof v === "boolean" ? v : v === "true" || v === "1",
      );
  },

  files: (
    type: FileType,
    options?: {
      minFiles?: number;
      maxFiles?: number;
      maxSize?: number;
    },
  ) => {
    const { mimeInvalid, tooLarge, tooFew, tooMany } = messages.files;
    const { displayName, accept, maxSize: metaMaxSize } = fileTypeConfig[type];

    const mimeTypes = accept.split(",").map((t) => t.trim());
    const minFiles = options?.minFiles ?? 0;
    const maxFiles = options?.maxFiles ?? 0;
    const maxSize =
      options?.maxSize && options.maxSize > 0 ? options.maxSize : metaMaxSize;

    let schema = z
      .file()
      .mime(mimeTypes, { error: mimeInvalid(displayName) })
      .min(1)
      .max(maxSize, { error: tooLarge(displayName, maxSize) })
      .array();

    if (minFiles > 0) {
      const message = tooFew(displayName, minFiles);
      schema = schema.min(minFiles, { error: message });
    }

    if (maxFiles > 0) {
      const message = tooMany(displayName, maxFiles);
      schema = schema.max(maxFiles, { error: message });
    }

    return schema;
  },

  date: (options?: {
    label?: string;
    min?: Date | "now";
    max?: Date | "now";
  }) => {
    const { tooEarly, tooLate } = messages.date;

    const label = options?.label ?? undefined;
    const min = options?.min;
    const max = options?.max;

    const invalidError = label && messages.invalid(label);
    let schema = z.date({ error: invalidError });

    if (min) {
      const value = min === "now" ? new Date() : min;
      const error = label && tooEarly(label, value);
      schema = schema.min(value, { error });
    }

    if (max) {
      const value = max === "now" ? new Date() : max;
      const error = label && tooLate(label, value);
      schema = schema.max(value, { error });
    }

    return schema;
  },

  dateMultiple: (options?: {
    label?: string;
    min?: Date | "now";
    max?: Date | "now";
    minDate?: number;
    maxDate?: number;
  }) => {
    const { invalid, required } = messages;
    const { tooEarly, tooLate, tooFew, tooMany } = messages.date;

    const label = options?.label ?? undefined;
    const minDate = options?.minDate;
    const maxDate = options?.maxDate;
    const min = options?.min;
    const max = options?.max;

    const invalidError = label && invalid(label);
    let dateSchema = z.date({ error: invalidError });

    if (min) {
      const value = min === "now" ? new Date() : min;
      const error = label && tooEarly(label, value);
      dateSchema = dateSchema.min(value, { error });
    }

    if (max) {
      const value = max === "now" ? new Date() : max;
      const error = label && tooLate(label, value);
      dateSchema = dateSchema.max(value, { error });
    }

    const arrayInvalidError = label
      ? "Beberapa tanggal yang dipilih tidak valid."
      : undefined;
    let schema = z.array(dateSchema, { error: arrayInvalidError });

    if (minDate) {
      const error = label && (minDate <= 1 ? required : tooFew)(label, minDate);
      schema = schema.min(minDate, { error });
    }

    if (maxDate) {
      const error = label && tooMany(label, maxDate);
      schema = schema.max(maxDate, { error });
    }

    return schema;
  },

  dateRange: (options?: {
    label?: string;
    min?: Date | "now";
    max?: Date | "now";
  }) => {
    const { tooEarly, tooLate } = messages.date;

    const label = options?.label ?? undefined;
    const min = options?.min;
    const max = options?.max;

    let fromSchema = z.date({ error: "Pilih tanggal mulai yang valid." });
    let toSchema = z.date({ error: "Pilih tanggal akhir yang valid." });

    if (min) {
      const value = min === "now" ? new Date() : min;
      const error = label && tooEarly(label, value);
      fromSchema = fromSchema.min(value, { error });
    }

    if (max) {
      const value = max === "now" ? new Date() : max;
      const error = label && tooLate(label, value);
      toSchema = toSchema.max(value, { error });
    }

    return z.object(
      { from: fromSchema, to: toSchema },
      { error: "Pilih rentang tanggal yang valid." },
    );
  },

  jsonString: <T>(schema: z.ZodType<T>) =>
    z
      .string()
      .transform((v) => {
        if (typeof v === "string") {
          if (!v) return undefined;

          try {
            return JSON.parse(v);
          } catch {
            throw new Error(messages.invalid("JSON"));
          }
        }
        return v;
      })
      .pipe(schema),

  email: z
    .email({ error: messages.invalid("Alamat email") })
    .trim()
    .toLowerCase()
    .min(1, { error: messages.required("Alamat email") })
    .max(255, { error: messages.string.tooLong("Alamat email", 255) }),

  password: z
    .string()
    .min(1, { error: messages.required("Kata sandi") })
    .min(8, { error: messages.string.tooShort("Kata sandi", 8) })
    .max(255, { error: messages.string.tooLong("Kata sandi", 255) })
    .regex(/[a-z]/, { error: messages.password.lowercase })
    .regex(/[A-Z]/, { error: messages.password.uppercase })
    .regex(/[0-9]/, { error: messages.password.number })
    .regex(/[^A-Za-z0-9]/, { error: messages.password.character }),

  gender: z.enum(allGenders, { error: messages.invalid("Jenis kelamin") }),
};

export function withSchemaPrefix<P extends string, S extends z.ZodRawShape>(
  prefix: P,
  schema: z.ZodObject<S>,
) {
  const prefixedShape = Object.fromEntries(
    Object.entries(schema.shape).map(([k, v]) => [`${prefix}${k}`, v]),
  ) as { [K in keyof S as `${P}${string & K}`]: S[K] };
  return z.object(prefixedShape);
}

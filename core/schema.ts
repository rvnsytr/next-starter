import { fileMeta } from "@/config/file";
import { messages } from "@/core/constants/messages";
import { allGenders, FileType } from "@/core/constants/registries";
import { toMegabytes } from "@/core/utils/formaters";
import z from "zod";

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
      min?: number;
      max?: number;
      maxFileSize?: number;
    },
  ) => {
    const { mimeInvalid, tooLarge, tooFew, tooMany } = messages.files;
    const { displayName, size, mimeTypes } = fileMeta[type];

    const min = options?.min ?? 0;
    const max = options?.max ?? 0;

    const mFS = options?.maxFileSize;
    const maxFileSize = mFS && mFS > 0 ? mFS : size.bytes;
    const maxFileSizeInMB = toMegabytes(maxFileSize).toFixed(2);

    let schema = z
      .file()
      .mime(mimeTypes, { error: mimeInvalid(displayName) })
      .min(1)
      .max(maxFileSize, { error: tooLarge(displayName, maxFileSizeInMB) })
      .array();

    if (min > 0) {
      const message = tooFew(displayName, min);
      schema = schema.min(min, { error: message });
    }

    if (max > 0) {
      const message = tooMany(displayName, max);
      schema = schema.max(max, { error: message });
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
    let schema = z.coerce.date({ error: invalidError });

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
    min?: number;
    max?: number;
    minDate?: Date | "now";
    maxDate?: Date | "now";
  }) => {
    const { invalid, required } = messages;
    const { tooEarly, tooLate, tooFew, tooMany } = messages.date;

    const label = options?.label ?? undefined;
    const min = options?.min;
    const max = options?.max;
    const minDate = options?.minDate;
    const maxDate = options?.maxDate;

    const invalidError = label && invalid(label);
    let dateSchema = z.date({ error: invalidError });

    if (minDate) {
      const value = minDate === "now" ? new Date() : minDate;
      const error = label && tooEarly(label, value);
      dateSchema = dateSchema.min(value, { error });
    }

    if (maxDate) {
      const value = maxDate === "now" ? new Date() : maxDate;
      const error = label && tooLate(label, value);
      dateSchema = dateSchema.max(value, { error });
    }

    const arrayInvalidError = label
      ? "Beberapa tanggal yang dipilih tidak valid."
      : undefined;
    let schema = z.array(dateSchema, { error: arrayInvalidError });

    if (min) {
      const error = label && (min <= 1 ? required : tooFew)(label, min);
      schema = schema.min(min, { error });
    }

    if (max) {
      const error = label && tooMany(label, max);
      schema = schema.max(max, { error });
    }

    return schema;
  },

  dateRange: z.object(
    {
      from: z.date({ error: "Pilih tanggal mulai yang valid." }),
      to: z.date({ error: "Pilih tanggal akhir yang valid." }),
    },
    { error: "Pilih rentang tanggal yang valid." },
  ),

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

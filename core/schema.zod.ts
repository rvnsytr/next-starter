import { allRoles } from "@/modules/auth";
import {
  sessionSchema as betterAuthSessionSchema,
  userSchema as betterAuthUserSchema,
} from "better-auth";
import z from "zod";
import { allGenders, fileMeta, FileType, messages } from "./constants";
import { toMegabytes } from "./utils";

// #region CORE

export const sharedSchemas = {
  string: (
    field: string,
    options?: { min?: number; max?: number; sanitize?: boolean },
  ) => {
    const { invalid, required } = messages;
    const { tooShort, tooLong } = messages.string;

    const min = options?.min;
    const max = options?.max;
    const sanitize = options?.sanitize ?? true;

    let schema = z.string({ error: invalid(field) }).trim();

    if (sanitize)
      schema = schema.regex(/^$|[A-Za-z0-9]/, { message: required(field) });

    if (min) {
      const message = min <= 1 ? required : tooShort;
      schema = schema.min(min, { error: message(field, min) });
    }

    if (max) {
      const message = tooLong(field, max);
      schema = schema.max(max, { error: message });
    }

    return schema;
  },

  number: (field: string, options?: { min?: number; max?: number }) => {
    const { invalid, required } = messages;
    const { tooSmall, tooLarge } = messages.number;

    const min = options?.min;
    const max = options?.max;

    let schema = z.coerce.number({ error: invalid(field) });

    if (min) {
      const message = min <= 1 ? required : tooSmall;
      schema = schema.min(min, { error: message(field, min) });
    }

    if (max) {
      const message = tooLarge(field, max);
      schema = schema.max(max, { error: message });
    }

    return schema;
  },

  boolean: (field: string) =>
    z
      .union(
        [
          z.boolean(),
          z.literal("true"),
          z.literal("false"),
          z.literal("1"),
          z.literal("0"),
        ],
        { error: messages.invalid(field) },
      )
      .transform((v) => {
        if (typeof v === "boolean") return v;
        return v === "true" || v === "1";
      }),

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

    const min = options?.min;
    const max = options?.max;
    const maxFileSize = options?.maxFileSize ?? size.bytes;
    const maxFileSizeInMB = toMegabytes(maxFileSize).toFixed(2);

    let schema = z
      .file()
      .mime(mimeTypes, { error: mimeInvalid(displayName) })
      .min(1)
      .max(maxFileSize, { error: tooLarge(displayName, maxFileSizeInMB) })
      .array();

    if (min) {
      const message = tooFew(displayName, min);
      schema = schema.min(min, { error: message });
    }

    if (max && max > 0) {
      const message = tooMany(displayName, max);
      schema = schema.max(max, { error: message });
    }

    return schema;
  },

  date: (
    field: string,
    options?: { min?: Date | "now"; max?: Date | "now" },
  ) => {
    const { tooEarly, tooLate } = messages.date;

    const min = options?.min;
    const max = options?.max;

    let schema = z.coerce.date({ error: messages.invalid(field) });

    if (min) {
      const value = min === "now" ? new Date() : min;
      const message = tooEarly(field, value);
      schema = schema.min(value, { error: message });
    }

    if (max) {
      const value = max === "now" ? new Date() : max;
      const message = tooLate(field, value);
      schema = schema.max(value, { error: message });
    }

    return schema;
  },

  dateMultiple: (
    field: string,
    options?: {
      min?: number;
      max?: number;
      minDate?: Date | "now";
      maxDate?: Date | "now";
    },
  ) => {
    const { invalid, required } = messages;
    const { tooEarly, tooLate, tooFew, tooMany } = messages.date;

    const min = options?.min;
    const max = options?.max;
    const minDate = options?.minDate;
    const maxDate = options?.maxDate;

    let dateSchema = z.date({ error: invalid(field) });

    if (minDate) {
      const value = minDate === "now" ? new Date() : minDate;
      const message = tooEarly(field, value);
      dateSchema = dateSchema.min(value, { error: message });
    }

    if (maxDate) {
      const value = maxDate === "now" ? new Date() : maxDate;
      const message = tooLate(field, value);
      dateSchema = dateSchema.max(value, { error: message });
    }

    let schema = z.array(dateSchema, {
      error: "Beberapa tanggal yang dipilih tidak valid.",
    });

    if (min) {
      const message = min <= 1 ? required : tooFew;
      schema = schema.min(min, { error: message(field, min) });
    }

    if (max) {
      const message = tooMany(field, max);
      schema = schema.max(max, { error: message });
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

  gender: z.enum(allGenders),
};

export const apiResponseSchema = z.object({
  code: z.number(),
  success: z.boolean(),
  message: z.string(),
  count: z
    .intersection(
      z.object({ total: z.number() }),
      z.record(z.string(), z.number()),
    )
    .optional(),
});

// #endregion

export const passwordSchema = z.object({
  password: sharedSchemas.string("Kata sandi", { min: 1 }),
  newPassword: sharedSchemas.password,
  confirmPassword: sharedSchemas.string("Konfirmasi kata sandi", { min: 1 }),
  currentPassword: sharedSchemas.string("Kata sandi saat ini", { min: 1 }),
});

export const userSchema = betterAuthUserSchema.extend({
  email: sharedSchemas.email,
  name: sharedSchemas.string("Nama", { min: 1 }),
  image: z.string().optional().nullable(),
  role: z.lazy(() => z.enum(allRoles)),
  banned: z.boolean().default(false),
  banReason: z.string().optional().nullable(),
  banExpires: z.date().optional().nullable(),
});

export const sessionSchema = betterAuthSessionSchema.extend({
  impersonatedBy: z.string().nullable().optional(),
});

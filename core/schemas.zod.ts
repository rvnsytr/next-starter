import { allRoles } from "@/modules/auth";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { id } from "zod/locales";
import { allGenders, fileMeta, FileType, messages } from "./constants";
import { user } from "./schemas.db";
import { toMegabytes } from "./utils";

z.config(id());

export const sharedSchemas = {
  string: (
    field: string,
    options?: { min?: number; max?: number; sanitize?: boolean },
  ) => {
    const { invalid, required, stringTooShort, stringTooLong } = messages;

    const min = options?.min;
    const max = options?.max;
    const sanitize = options?.sanitize ?? true;

    let schema = z.string({ error: invalid(field) }).trim();

    if (sanitize)
      schema = schema.regex(/[A-Za-z0-9]/, { message: required(field) });

    if (min) {
      const message = min <= 1 ? required : stringTooShort;
      schema = schema.min(min, { error: message(field, min) });
    }

    if (max) {
      const message = stringTooLong(field, max);
      schema = schema.max(max, { error: message });
    }

    return schema;
  },

  number: (field: string, options?: { min?: number; max?: number }) => {
    const { invalid, required, numberTooSmall, numberTooLarge } = messages;

    const min = options?.min;
    const max = options?.max;

    let schema = z.coerce.number({ error: invalid(field) });

    if (min) {
      const message = min <= 1 ? required : numberTooSmall;
      schema = schema.min(min, { error: message(field, min) });
    }

    if (max) {
      const message = numberTooLarge(field, max);
      schema = schema.max(max, { error: message });
    }

    return schema;
  },

  file: (
    type: FileType,
    options?: {
      min?: number;
      max?: number;
      maxFileSize?: number;
    },
  ) => {
    const { fileToFew, fileTooMany, fileTooLarge } = messages;

    const { displayName, size, mimeTypes } = fileMeta[type];

    const min = options?.min;
    const max = options?.max;

    const maxFileSize = options?.maxFileSize ?? size.bytes;
    const maxFileSizeInMB = toMegabytes(maxFileSize).toFixed(2);

    let schema = z
      .file()
      .mime(mimeTypes, { error: `Tipe ${displayName} tidak valid.` })
      .min(1)
      .max(maxFileSize, {
        error: fileTooLarge(displayName, maxFileSizeInMB),
      })
      .array();

    if (min) {
      const message = fileToFew(displayName, min);
      schema = schema.min(min, { error: message });
    }

    if (max && max > 0) {
      const message = fileTooMany(displayName, max);
      schema = schema.max(max, { error: message });
    }

    return schema;
  },

  date: (
    field: string,
    options?: { min?: Date | "now"; max?: Date | "now" },
  ) => {
    const { invalid, dateToEarly, dateTooLate } = messages;

    const min = options?.min;
    const max = options?.max;

    let schema = z.coerce.date({ error: invalid(field) });

    if (min) {
      const value = min === "now" ? new Date() : min;
      const message = dateToEarly(field, value);
      schema = schema.min(value, { error: message });
    }

    if (max) {
      const value = max === "now" ? new Date() : max;
      const message = dateTooLate(field, value);
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
    const {
      invalid,
      required,
      dateToEarly,
      dateTooLate,
      dateToFew,
      dateTooMany,
    } = messages;

    const min = options?.min;
    const max = options?.max;
    const minDate = options?.minDate;
    const maxDate = options?.maxDate;

    let dateSchema = z.date({ error: invalid(field) });

    if (minDate) {
      const value = minDate === "now" ? new Date() : minDate;
      const message = dateToEarly(field, value);
      dateSchema = dateSchema.min(value, { error: message });
    }

    if (maxDate) {
      const value = maxDate === "now" ? new Date() : maxDate;
      const message = dateTooLate(field, value);
      dateSchema = dateSchema.max(value, { error: message });
    }

    let schema = z.array(dateSchema, {
      error: "Beberapa tanggal yang dipilih tidak valid.",
    });

    if (min) {
      const message = min <= 1 ? required : dateToFew;
      schema = schema.min(min, { error: message(field, min) });
    }

    if (max) {
      const message = dateTooMany(field, max);
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

  email: z
    .email({ error: messages.invalid("Alamat email") })
    .trim()
    .toLowerCase()
    .min(1, { error: messages.required("Alamat email") })
    .max(255, { error: messages.stringTooLong("Alamat email", 255) }),

  password: z
    .string()
    .min(1, { error: messages.required("Kata sandi") })
    .min(8, { error: messages.stringTooShort("Kata sandi", 8) })
    .max(255, { error: messages.stringTooLong("Kata sandi", 255) })
    .regex(/[A-Z]/, {
      error: `Kata sandi harus mengandung huruf kapital. (A-Z)`,
    })
    .regex(/[a-z]/, {
      error: `Kata sandi harus mengandung huruf kecil. (a-z)`,
    })
    .regex(/[0-9]/, {
      error: `Kata sandi harus mengandung angka. (0-9)`,
    })
    .regex(/[^A-Za-z0-9]/, {
      error: `Kata sandi harus mengandung karakter khusus.`,
    }),

  gender: z.enum(allGenders),

  deletedAt: z.coerce
    .date({ error: "Field 'deletedAt' tidak valid." })
    .nullable()
    .default(null),
  deletedBy: z
    .string({ error: "Field 'deletedBy' tidak valid." })
    .nullable()
    .default(null),

  updatedAt: z.coerce
    .date({ error: "Field 'updatedAt' tidak valid." })
    .nullable()
    .default(null),
  updatedBy: z
    .string({ error: "Field 'updatedBy' tidak valid." })
    .nullable()
    .default(null),

  createdAt: z.coerce.date({ error: "Field 'createdAt' tidak valid." }),
  createdBy: z.string({ error: "Field 'createdBy' tidak valid." }).nullable(),
};

export const apiResponseSchema = z.object({
  code: z.number(),
  success: z.boolean(),
  message: z.string(),
});

export const userSchema = createSelectSchema(user, {
  name: () => sharedSchemas.string("Nama", { min: 1 }),
  email: () => sharedSchemas.email,
  role: () => z.enum(allRoles),
}).extend({
  password: sharedSchemas.string("Kata sandi", { min: 1 }),
  newPassword: sharedSchemas.password,
  confirmPassword: sharedSchemas.string("Konfirmasi kata sandi", { min: 1 }),
  currentPassword: sharedSchemas.string("Kata sandi saat ini", { min: 1 }),
});

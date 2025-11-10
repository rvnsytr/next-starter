import { z } from "zod";
import { id } from "zod/locales";
import { allGenders, fileMeta, FileType } from "../constants";
import { toMegabytes } from "../utils";
import { messages } from "./content";
import { allRoles } from "./permission";

z.config(id());

export const zodSchemas = {
  string: (field: string, options?: { min?: number; max?: number }) => {
    const { invalidType, required, stringTooShort, stringTooLong } = messages;

    const min = options?.min;
    const max = options?.max;

    let schema = z.string({ error: invalidType(field, "string") }).trim();

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
    const { invalidType, required, numberTooSmall, numberTooLarge } = messages;

    const min = options?.min;
    const max = options?.max;

    let schema = z.coerce.number({ error: invalidType(field, "number") });

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

    let schema = z.array(
      z
        .file()
        .mime(mimeTypes, { error: `Tipe ${displayName} tidak valid.` })
        .min(1)
        .max(maxFileSize, {
          error: fileTooLarge(displayName, maxFileSizeInMB),
        }),
    );

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

  date: (field?: string, asField: boolean = false) =>
    z.coerce.date({
      error: messages[asField ? "required" : "invalidType"](
        `tanggal${field ? ` ${field.toLowerCase()}` : ""}`,
        "date",
      ),
    }),

  dateMultiple: (options?: { field?: string; min?: number; max?: number }) => {
    const { invalidType, required, dateToFew, dateTooMany } = messages;

    const field = `tanggal${options?.field ? ` ${options.field.toLowerCase()}` : ""}`;
    const min = options?.min;
    const max = options?.max;

    let schema = z.array(z.date({ error: invalidType(field, "date") }), {
      error: "Beberapa tanggal yang dimasukkan tidak valid.",
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

  updatedAt: z.coerce.date({ error: "Field 'updatedAt' tidak valid." }),
  createdAt: z.coerce.date({ error: "Field 'createdAt' tidak valid." }),
};

export const zodApiResponse = z.object({
  code: z.number(),
  message: z.string(),
  success: z.boolean(),
});

export const zodUser = z.object({
  role: z.enum(allRoles),
  email: zodSchemas.email,
  name: zodSchemas.string("Nama", { min: 1 }),

  password: zodSchemas.string("Kata sandi", { min: 1 }),
  newPassword: zodSchemas.password,
  confirmPassword: zodSchemas.string("Konfirmasi kata sandi", { min: 1 }),
  currentPassword: zodSchemas.string("Kata sandi saat ini", { min: 1 }),

  rememberMe: z.boolean(),
  revokeOtherSessions: z.boolean(),
  agreement: z.boolean().refine((v) => v, {
    error:
      "Mohon setujui ketentuan layanan dan kebijakan privasi untuk melanjutkan.",
  }),
});

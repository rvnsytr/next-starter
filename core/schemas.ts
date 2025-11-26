import { z } from "zod";
import { id } from "zod/locales";
import { allGenders, fileMeta, FileType, messages } from "./constants";
import { toMegabytes } from "./utils";

z.config(id());

export const sharedSchemas = {
  string: (field: string, options?: { min?: number; max?: number }) => {
    const { invalid, required, stringTooShort, stringTooLong } = messages;

    const min = options?.min;
    const max = options?.max;

    let schema = z.string({ error: invalid(field) }).trim();

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

  date: (field: string, options?: { min?: Date; max?: Date }) => {
    const { invalid, dateToEarly, dateTooLate } = messages;

    const min = options?.min;
    const max = options?.max;

    let schema = z.coerce.date({ error: invalid(field) });

    if (min) {
      const message = dateToEarly(field, min);
      schema = schema.min(min, { error: message });
    }

    if (max) {
      const message = dateTooLate(field, max);
      schema = schema.max(max, { error: message });
    }

    return schema;
  },

  dateMultiple: (
    field: string,
    options?: {
      min?: number;
      max?: number;
      minDate?: Date;
      maxDate?: Date;
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
      const message = dateToEarly(field, minDate);
      dateSchema = dateSchema.min(minDate, { error: message });
    }

    if (maxDate) {
      const message = dateTooLate(field, maxDate);
      dateSchema = dateSchema.max(maxDate, { error: message });
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

  updatedAt: z.coerce.date({ error: "Field 'updatedAt' tidak valid." }),
  createdAt: z.coerce.date({ error: "Field 'createdAt' tidak valid." }),
};

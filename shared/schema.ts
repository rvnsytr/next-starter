import { file } from "@/shared/db/schema";
import { createSelectSchema } from "drizzle-orm/zod";
import z from "zod";
import { FileType, fileTypes, genders } from "./constants";
import { messages } from "./messages";

type FileSchemaOptions = {
  maxSize?: number;
};

type FilesSchemaOptions = FileSchemaOptions & {
  minFiles?: number;
  maxFiles?: number;
};

export const sharedSchemas = {
  string: (options?: {
    label?: string;
    min?: number;
    max?: number;
    /** @default false */
    coerce?: boolean;
    /** @default true */
    trim?: boolean;
    /** @default true */
    sanitize?: boolean;
    /** @default false */
    withRequired?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): z.ZodType<string, any> => {
    const { invalid, required } = messages;
    const { tooShort, tooLong } = messages.string;

    const label = options?.label ?? undefined;
    const min = options?.min ?? null;
    const max = options?.max ?? null;
    const coerce = options?.coerce ?? false;
    const trim = options?.trim ?? true;
    const sanitize = options?.sanitize ?? true;
    const withRequired = options?.withRequired ?? false;

    const invalidError = label && invalid(label);
    let schema = coerce
      ? z.coerce.string({ error: invalidError })
      : z.string({ error: invalidError });

    if (trim) schema = schema.trim();

    if (sanitize)
      schema = schema.regex(/^$|[A-Za-z0-9]/, { message: invalidError });

    if (min) {
      const error =
        label && (min <= 1 && withRequired ? required : tooShort)(label, min);
      schema = schema.min(min, { error });
    }

    if (max) {
      const error = label && tooLong(label, max);
      schema = schema.max(max, { error });
    }

    return schema;
  },

  number: (options?: {
    label?: string;
    min?: number;
    max?: number;
    coerce?: boolean;
    /** @default false */
    withRequired?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): z.ZodType<number, any> => {
    const { invalid, required } = messages;
    const { tooSmall, tooLarge } = messages.number;

    const label = options?.label ?? undefined;
    const min = options?.min ?? null;
    const max = options?.max ?? null;
    const coerce = options?.coerce ?? false;
    const withRequired = options?.withRequired ?? true;

    const invalidError = label && invalid(label);
    let schema = coerce
      ? z.coerce.number({ error: invalidError })
      : z.number({ error: invalidError });

    if (min) {
      const error =
        label && (min <= 1 && withRequired ? required : tooSmall)(label, min);
      schema = schema.min(min, { error });
    }

    if (max) {
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
      ? "Some of the selected dates are not valid."
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

    let fromSchema = z.date({ error: "Please select a valid start date." });
    let toSchema = z.date({ error: "Please select a valid end date." });

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

  file: (type: FileType, options?: FileSchemaOptions) => {
    const { mimeInvalid, tooLarge } = messages.files;
    const { label, accept, maxSize: defaultMaxSize } = fileTypes.meta[type];

    const mimeTypes =
      accept === "*" ? [] : accept.split(",").map((t) => t.trim());
    const maxSize =
      options?.maxSize && options.maxSize > 0
        ? options.maxSize
        : defaultMaxSize;

    let schema = z
      .file()
      .min(1)
      .max(maxSize, { error: tooLarge(label, maxSize) });

    if (mimeTypes.length) {
      const error = mimeInvalid(label);
      schema = schema.mime(mimeTypes, { error });
    }

    return schema;
  },

  files(type: FileType, options?: FilesSchemaOptions) {
    const { tooFew, tooMany } = messages.files;
    const { label } = fileTypes.meta[type];

    const minFiles = options?.minFiles ?? 0;
    const maxFiles = options?.maxFiles ?? 0;

    let schema = z.array(this.file(type, options));

    if (minFiles > 0) {
      const message = tooFew(label, minFiles);
      schema = schema.min(minFiles, { error: message });
    }

    if (maxFiles > 0) {
      const message = tooMany(label, maxFiles);
      schema = schema.max(maxFiles, { error: message });
    }

    return schema;
  },

  fileMetadata: createSelectSchema(file)
    .pick({ id: true, path: true, name: true, type: true, size: true })
    .extend({ url: z.string().optional() }),

  fileWithPreview(type: FileType, options?: FileSchemaOptions) {
    const fileSchema = this.file(type, options);
    return z.object({
      id: z.string(),
      file: z.union([fileSchema, this.fileMetadata]),
      preview: z.string().optional(),
    });
  },

  filesWithPreview(type: FileType, options?: FilesSchemaOptions) {
    const { tooFew, tooMany } = messages.files;
    const { label } = fileTypes.meta[type];

    const minFiles = options?.minFiles ?? 0;
    const maxFiles = options?.maxFiles ?? 0;

    let schema = z.array(this.fileWithPreview(type, options));

    if (minFiles > 0) {
      const message = tooFew(label, minFiles);
      schema = schema.min(minFiles, { error: message });
    }

    if (maxFiles > 0) {
      const message = tooMany(label, maxFiles);
      schema = schema.max(maxFiles, { error: message });
    }

    return schema;
  },

  email: z
    .email({ error: messages.invalid("Email address") })
    .trim()
    .toLowerCase()
    .min(1, { error: messages.required("Email address") })
    .max(255, { error: messages.string.tooLong("Email address", 255) }),

  password: z
    .string()
    .min(1, { error: messages.required("Password") })
    .min(8, { error: messages.string.tooShort("Password", 8) })
    .max(255, { error: messages.string.tooLong("Password", 255) })
    .regex(/[a-z]/, { error: messages.password.lowercase })
    .regex(/[A-Z]/, { error: messages.password.uppercase })
    .regex(/[0-9]/, { error: messages.password.number })
    .regex(/[^A-Za-z0-9]/, { error: messages.password.character }),

  gender: z.enum(genders.values, { error: messages.invalid("Jenis kelamin") }),
};

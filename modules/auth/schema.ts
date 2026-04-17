import { sharedSchemas } from "@/core/schema";
import { user } from "@/shared/db/schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

export const passwordSchema = z.object({
  password: sharedSchemas.string({ label: "Kata sandi", min: 1 }),
  newPassword: sharedSchemas.password,
  confirmPassword: sharedSchemas.string({
    label: "Konfirmasi kata sandi",
    min: 1,
  }),
  currentPassword: sharedSchemas.string({
    label: "Kata sandi saat ini",
    min: 1,
  }),
});

export const userSchema = createSelectSchema(user, {
  email: sharedSchemas.email,
  name: sharedSchemas.string({ label: "Nama", min: 1 }),
});

import { sharedSchemas } from "@/core/schemas";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { allRoles } from "./constants";
import { user } from "./schemas.db";

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

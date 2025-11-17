import { allRoles } from "@/core/permission";
import { sharedSchemas } from "@/core/zod";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { user } from "./db.schemas";

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

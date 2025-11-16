import { allRoles } from "@/core/permission";
import { zodSchemas } from "@/core/zod";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { user } from "./db.schemas";

export const userSchema = createSelectSchema(user, {
  name: () => zodSchemas.string("Nama", { min: 1 }),
  email: () => zodSchemas.email,
  role: () => z.enum(allRoles),
}).extend({
  password: zodSchemas.string("Kata sandi", { min: 1 }),
  newPassword: zodSchemas.password,
  confirmPassword: zodSchemas.string("Konfirmasi kata sandi", { min: 1 }),
  currentPassword: zodSchemas.string("Kata sandi saat ini", { min: 1 }),
});

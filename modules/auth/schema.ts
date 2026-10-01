import { users } from "@/shared/db/schema";
import { sharedSchemas } from "@/shared/schema";
import { createSelectSchema } from "drizzle-orm/zod";
import z from "zod";

export const passwordSchema = z.object({
  password: sharedSchemas.string({ label: "Password", min: 1 }),
  newPassword: sharedSchemas.password,
  confirmPassword: sharedSchemas.string({
    label: "Confirm password",
    min: 1,
  }),
  currentPassword: sharedSchemas.string({
    label: "Current password",
    min: 1,
  }),
});

export const usersSchema = createSelectSchema(users, {
  email: sharedSchemas.email,
  name: sharedSchemas.string({ label: "Name", min: 1, withRequired: true }),
});

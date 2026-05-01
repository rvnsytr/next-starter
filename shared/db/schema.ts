import { allActivityType } from "@/modules/activity/schema";
import {
  bigint,
  boolean,
  index,
  snakeCase,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { allRoles } from "../permission";

export const user = snakeCase.table(
  "user",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: boolean().default(false).notNull(),
    image: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    role: text({ enum: allRoles }).default("user").notNull(),
    banned: boolean().default(false),
    banReason: text(),
    banExpires: timestamp(),
  },
  (table) => [
    index("user_role_idx").on(table.role),
    index("user_banned_idx").on(table.banned),
  ],
);

export const session = snakeCase.table(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: timestamp().notNull(),
    token: text().notNull().unique(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text(),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = snakeCase.table(
  "account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = snakeCase.table(
  "verification",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const file = snakeCase.table(
  "file",
  {
    id: uuid().primaryKey().defaultRandom(),

    filePath: text().notNull(),
    fileName: text().notNull(),
    mimeType: text().notNull(),
    fileSize: bigint({ mode: "number" }).notNull(),

    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [index("file_file_path_idx").on(table.filePath)],
);

export type Activity = typeof activity.$inferSelect;
export type ActivityWithEntity = Activity & { entity?: string };
export const activity = snakeCase.table(
  "activity",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    type: text({ enum: allActivityType }).notNull(),
    entityId: text(),
    data: text(),

    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [index("activity_type_idx").on(table.type)],
);

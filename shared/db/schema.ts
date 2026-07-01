import { allActivityEventTypes } from "@/modules/activity/config";
import { index, snakeCase, unique } from "drizzle-orm/pg-core";
import { allRoles } from "../permission";

export const user = snakeCase.table(
  "user",
  (t) => ({
    id: t.text().primaryKey(),
    name: t.text().notNull(),
    email: t.text().notNull().unique(),
    emailVerified: t.boolean().notNull().default(false),
    image: t.text(),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    role: t.text({ enum: allRoles }).notNull().default("user"),
    banned: t.boolean().default(false),
    banReason: t.text(),
    banExpires: t.timestamp(),
  }),
  (t) => [
    index("IDX_user_role").on(t.role),
    index("IDX_user_banned").on(t.banned),
  ],
);

export const account = snakeCase.table(
  "account",
  (t) => ({
    id: t.text().primaryKey(),
    accountId: t.text().notNull(),
    providerId: t.text().notNull(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: t.text(),
    refreshToken: t.text(),
    idToken: t.text(),
    accessTokenExpiresAt: t.timestamp(),
    refreshTokenExpiresAt: t.timestamp(),
    scope: t.text(),
    password: t.text(),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp()
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    unique("UQ_account_provider_id_account_id").on(t.providerId, t.accountId),
    index("IDX_account_user_id").on(t.userId),
  ],
);

export const session = snakeCase.table(
  "session",
  (t) => ({
    id: t.text().primaryKey(),
    expiresAt: t.timestamp().notNull(),
    token: t.text().notNull().unique(),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp()
      .notNull()
      .$onUpdate(() => new Date()),
    ipAddress: t.text(),
    userAgent: t.text(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: t.text(),
  }),
  (t) => [index("IDX_session_user_id").on(t.userId)],
);

export const verification = snakeCase.table(
  "verification",
  (t) => ({
    id: t.text().primaryKey(),
    identifier: t.text().notNull(),
    value: t.text().notNull(),
    expiresAt: t.timestamp().notNull(),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [unique("UQ_verification_identifier_value").on(t.identifier, t.value)],
);

export type Activity = typeof activity.$inferSelect;
export type ActivityEventType = Activity["eventType"];
export type ActivityWithEntity = Activity & { entity?: string };
export const activity = snakeCase.table(
  "activity",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    entityId: t.text(),

    eventType: t.text({ enum: allActivityEventTypes }).notNull(),
    data: t.text(),

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (t) => [
    index("IDX_activity_type").on(t.eventType),
    index("IDX_activity_user_id_created_at").on(t.userId, t.createdAt),
  ],
);

export type FileTable = typeof file.$inferSelect;
export type FileVisibility = FileTable["visibility"];
export const file = snakeCase.table(
  "file",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    path: t.text().notNull(),
    name: t.text().notNull(),
    type: t.text().notNull(),
    size: t.bigint({ mode: "number" }).notNull(),

    visibility: t
      .text({ enum: ["private", "public"] })
      .default("private")
      .notNull(),

    updatedAt: t
      .timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (t) => [
    index("IDX_file_file_path").on(t.path),
    index("IDX_file_visibility").on(t.visibility),
  ],
);

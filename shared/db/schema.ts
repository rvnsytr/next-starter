import { ACTIVITY_EVENT_TYPES } from "@/modules/activity/constants";
import { index, snakeCase, uniqueIndex } from "drizzle-orm/pg-core";
import { roles } from "../permission";

export const files = snakeCase.table(
  "files",
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
    index("IDX_files_filePath").on(t.path),
    index("IDX_files_visibility").on(t.visibility),
  ],
);

export const users = snakeCase.table(
  "users",
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
    role: t.text({ enum: roles }).notNull().default("user"),
    banned: t.boolean().default(false),
    banReason: t.text(),
    banExpires: t.timestamp(),
  }),
  (t) => [
    index("IDX_user_role").on(t.role),
    index("IDX_user_banned").on(t.banned),
  ],
);

export const accounts = snakeCase.table(
  "accounts",
  (t) => ({
    id: t.text().primaryKey(),
    issuer: t.text().notNull(),
    accountId: t.text().notNull(),
    providerId: t.text().notNull(),
    userId: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
    uniqueIndex("UIDX_accounts_issuer_accountId").on(t.issuer, t.accountId),
    index("IDX_accounts_userId").on(t.userId),
  ],
);

export const sessions = snakeCase.table(
  "sessions",
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
      .references(() => users.id, { onDelete: "cascade" }),
    impersonatedBy: t.text(),
  }),
  (t) => [index("IDX_session_userId").on(t.userId)],
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
  (t) => [index("IDX_verifications_identifier").on(t.identifier)],
);

export const activities = snakeCase.table(
  "activities",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    eventType: t.text({ enum: ACTIVITY_EVENT_TYPES }).notNull(),

    userId: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    entityId: t.text(),

    data: t.text(),

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (t) => [
    index("IDX_activities_type").on(t.eventType),
    index("IDX_activities_user_id_created_at").on(t.userId, t.createdAt),
  ],
);

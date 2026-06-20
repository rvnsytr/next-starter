import { allActivityEventTypes } from "@/modules/activity/config";
import {
  bigint,
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { allRoles } from "../permission";

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    role: text("role", { enum: allRoles }).notNull().default("user"),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
  },
  (t) => [
    index("IDX_user_role").on(t.role),
    index("IDX_user_banned").on(t.banned),
  ],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    unique("UQ_account_provider_id_account_id").on(t.providerId, t.accountId),
    index("IDX_account_user_id").on(t.userId),
  ],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (t) => [index("IDX_session_user_id").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique("UQ_verification_identifier_value").on(t.identifier, t.value)],
);

export type Activity = typeof activity.$inferSelect;
export type ActivityEventType = Activity["eventType"];
export type ActivityWithEntity = Activity & { entity?: string };
export const activity = pgTable(
  "activity",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    entityId: text("entity_id"),

    eventType: text("event_type", { enum: allActivityEventTypes }).notNull(),
    data: text("data"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("IDX_activity_type").on(t.eventType),
    index("IDX_activity_user_id_created_at").on(t.userId, t.createdAt),
  ],
);

export type FileTable = typeof file.$inferSelect;
export type FileVisibility = FileTable["visibility"];
export const file = pgTable(
  "file",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    path: text("path").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    size: bigint("size", { mode: "number" }).notNull(),

    visibility: text("visibility", { enum: ["private", "public"] })
      .default("private")
      .notNull(),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("IDX_file_file_path").on(t.path),
    index("IDX_file_visibility").on(t.visibility),
  ],
);

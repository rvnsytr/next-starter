import { index, snakeCase } from "drizzle-orm/pg-core";

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

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("IDX_files_filePath").on(t.path),
    index("IDX_files_visibility").on(t.visibility),
  ],
);

export const users = snakeCase.table(
  "users",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    name: t.text().notNull(),
    email: t.text().notNull().unique(),
    emailVerified: t.boolean().notNull().default(false),
    image: t.text(),
    role: t
      .text({ enum: ["user", "admin"] })
      .notNull()
      .default("user"),

    banned: t.boolean().default(false),
    banReason: t.text(),
    banExpires: t.timestamp(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("IDX_users_role").on(t.role),
    index("IDX_users_banned").on(t.banned),
  ],
);

export const accounts = snakeCase.table(
  "accounts",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    accountId: t.text().notNull(),
    providerId: t.text().notNull(),
    userId: t
      .uuid()
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
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [index("IDX_accounts_userId").on(t.userId)],
);

export const sessions = snakeCase.table(
  "sessions",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    userId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    token: t.text().notNull().unique(),
    ipAddress: t.text(),
    userAgent: t.text(),

    impersonatedBy: t.text(),

    expiresAt: t.timestamp().notNull(),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [index("IDX_sessions_userId").on(t.userId)],
);

export const verifications = snakeCase.table(
  "verifications",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    identifier: t.text().notNull(),
    value: t.text().notNull(),

    expiresAt: t.timestamp().notNull(),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp()
      .notNull()
      .defaultNow()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (t) => [index("IDX_verifications_identifier").on(t.identifier)],
);

// export const histories = snakeCase.table(
//   "histories",
//   (t) => ({
//     id: t.uuid().primaryKey().defaultRandom(),

//     userId: t
//       .uuid()
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     entityId: t.text(),

//     eventType: t.text().notNull(),
//     data: t.text(),

//     createdAt: t.timestamp().notNull().defaultNow(),
//   }),
//   (t) => [
//     index("IDX_activities_type").on(t.eventType),
//     index("IDX_activities_user_id_created_at").on(t.userId, t.createdAt),
//   ],
// );

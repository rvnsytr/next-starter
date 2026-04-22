import { appConfig } from "@/shared/config";
import { user } from "@/shared/db/schema";
import { ac, roles } from "@/shared/permission";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { db } from "./db";
import { deleteFiles } from "./s3";

export type ACStatements = typeof ac.statements;
export type Permissions = {
  [K in keyof ACStatements]?: ACStatements[K][number][];
};

export type AuthSession = typeof auth.$Infer.Session;

export type Role = (typeof user.$inferSelect)["role"];
export const defaultRole: Role = "user";

export const auth = betterAuth({
  appName: appConfig.name,

  database: drizzleAdapter(db, { provider: "pg" }),
  // experimental: { joins: true },

  plugins: [nextCookies(), openAPI(), adminPlugin({ ac, roles, defaultRole })],

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // sendResetPassword: async ({ user, token }) => {
    //   const { name, email } = user;
    //   const url = `${appConfig.cors.origin}/reset-password?token=${token}`;
    //   void novu.trigger("purnaku-reset-password", {
    //     to: { subscriberId: email, email },
    //     payload: { name, url },
    //   });
    // },
    // onPasswordReset: async ({ user }) => {
    //   await db
    //     .insertInto("event_log")
    //     .values({ type: "password-reset", user_id: user.id })
    //     .execute();
    // },
  },

  emailVerification: {
    // sendOnSignUp: true,
    // sendVerificationEmail: async ({ user, token }) => {
    //   const { name, email } = user;
    //   const url = `${appConfig.cors.origin}/verify-user?token=${token}`;
    //   void novu.trigger("purnaku-verification", {
    //     to: { subscriberId: email, email },
    //     payload: { name, url },
    //   });
    // },
    // afterEmailVerification: async (user) => {
    //   await db
    //     .insertInto("event_log")
    //     .values({ type: "user-verified", user_id: user.id })
    //     .execute();
    // },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"],
        input: false,
        defaultValue: defaultRole,
      },
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const { session, newSession } = ctx.context;

      if (ctx.path === "/update-user") {
        const oldImageId = session?.user.image;
        const newImageId = newSession?.user.image;

        if (oldImageId && oldImageId !== newImageId) deleteFiles([oldImageId]);
      }
    }),
  },
});

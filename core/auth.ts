import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  admin as adminPlugin,
  createAuthMiddleware,
} from "better-auth/plugins";
import { appMeta } from "./constants";
import { db } from "./db";
import { ac, roles } from "./permission";
import { removeFiles } from "./storage";

export type AuthSession = typeof auth.$Infer.Session;
export type Role = keyof typeof roles;

export const allRoles = Object.keys(roles) as Role[];
export const defaultRole: Role = "user";

export const auth = betterAuth({
  appName: appMeta.name,

  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [nextCookies(), adminPlugin({ ac, roles, defaultRole })],

  emailAndPassword: { enabled: true, autoSignIn: false },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: allRoles,
        defaultValue: defaultRole,
        input: false,
      },
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const { session, newSession } = ctx.context;

      if (ctx.path === "/update-user") {
        const oldImageId = session?.user.image;
        const newImageId = newSession?.user.image;

        if (oldImageId && oldImageId !== newImageId)
          removeFiles([oldImageId], { isPublicUrl: true });
      }
    }),
  },
});

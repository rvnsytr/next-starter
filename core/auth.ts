import { allRoles, defaultRole } from "@/modules/auth/constants";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  admin as adminPlugin,
  createAuthMiddleware,
} from "better-auth/plugins";
import { appMeta } from "./constants/app";
import { db } from "./db";
import { ac, roles } from "./permission";
import { getPresignUrl, removeFiles } from "./storage";

export const auth = betterAuth({
  appName: appMeta.name,

  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [nextCookies(), adminPlugin({ ac, roles, defaultRole })],

  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: { type: [...allRoles], defaultValue: defaultRole, input: false },
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const { session, newSession } = ctx.context;

      if (ctx.path === "/get-session") {
        if (!session) return ctx.json(null);

        const { session: sessionData, user: userData } = session;
        if (!userData.image) return ctx.json(session);

        return ctx.json({
          session: sessionData,
          user: {
            ...userData,
            image: await getPresignUrl(userData.image),
          },
        });
      }

      if (ctx.path === "/update-user") {
        const oldImageKey = session?.user.image;
        const newImageKey = newSession?.user.image;

        if (oldImageKey && oldImageKey !== newImageKey)
          removeFiles([oldImageKey]);
      }
    }),
  },
});

import { adminRoles, defaultRole } from "@/modules/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugins, lastLoginMethod } from "better-auth/plugins";
import { appMeta } from "./constants";
import { db } from "./db";
import { roles } from "./permission";

export const auth = betterAuth({
  appName: appMeta.name,
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true, autoSignIn: false },
  plugins: [
    nextCookies(),
    adminPlugins({ roles, adminRoles }),
    lastLoginMethod(),
  ],
  user: {
    deleteUser: { enabled: true },
    additionalFields: {
      role: { type: "string", input: false, defaultValue: defaultRole },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});

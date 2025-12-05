import { adminRoles, defaultRole } from "@/modules/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { appMeta } from "./constants";
import { db } from "./db";
import { roles } from "./permission";

export const auth = betterAuth({
  appName: appMeta.name,

  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [nextCookies(), adminPlugin({ roles, adminRoles })],

  emailAndPassword: { enabled: true, autoSignIn: false },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", input: false, defaultValue: defaultRole },
    },
  },
});

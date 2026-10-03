import { DEFAULT_ROLE, ROLES } from "@/modules/auth/constants/roles";
import { APP_NAME } from "@/shared/constants";
import * as schema from "@/shared/db/schema";
import { ac, roles } from "@/shared/permission";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { createPublicUrls } from "./s3";
import { isValidUrl } from "./utils";

export type ACStatements = typeof ac.statements;
export type Permissions = {
  [K in keyof ACStatements]?: ACStatements[K][number][];
};

export type AuthSession = typeof auth.$Infer.Session;
export type Session = AuthSession["session"];
export type User = AuthSession["user"];

export const auth = betterAuth({
  appName: APP_NAME,

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
  advanced: {
    database: {
      joins: true,
      generateId: () => crypto.randomUUID(),
    },
  },

  plugins: [
    openAPI(),
    adminPlugin({ ac, roles, defaultRole: DEFAULT_ROLE }),
    nextCookies(),
  ],

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  socialProviders: {
    github: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GITHUB_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: [...ROLES],
        input: false,
        defaultValue: DEFAULT_ROLE,
      },
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const { session } = ctx.context;

      if (ctx.path === "/get-session") {
        if (!session) return ctx.json(null);

        const { session: sessionData, user: userData } = session;
        if (!userData.image) return ctx.json(session);

        if (isValidUrl(userData.image)) return ctx.json(session);

        const data = await db
          .select({ path: schema.files.path })
          .from(schema.files)
          .where(eq(schema.files.id, userData.image));

        if (!data.length) return ctx.json(session);

        const [image] = createPublicUrls([data[0].path]);
        return ctx.json({ session: sessionData, user: { ...userData, image } });
      }
    }),
  },
});

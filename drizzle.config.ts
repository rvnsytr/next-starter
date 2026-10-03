import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./shared/db/schema.ts",
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  dbCredentials: { url: process.env.DATABASE_URL! },
  schemaFilter: ["public"],
});

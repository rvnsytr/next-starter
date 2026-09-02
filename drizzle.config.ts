import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./shared/db/schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL! },
});

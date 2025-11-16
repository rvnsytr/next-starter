import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./core/db",
  schema: "./core/db/schemas.ts",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});

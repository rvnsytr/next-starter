import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./out",
  schema: "./core/schema.db.ts",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});

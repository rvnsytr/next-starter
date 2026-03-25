import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./out",
  schema: "./config/db.schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});

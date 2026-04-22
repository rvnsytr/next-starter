import { relations } from "@/shared/db/relations";
import * as schema from "@/shared/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!, { schema, relations });

import { relations } from "@/shared/db/relations";
import * as schema from "@/shared/db/schema";
import { sql, SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!, { schema, relations });

export const countWhere = <T>(condition: SQL<T>) =>
  sql<number>`COUNT(*) FILTER (WHERE ${condition})`;

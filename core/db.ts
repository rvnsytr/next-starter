import { relations } from "@/shared/db/relations";
import { sql, SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const db = drizzle(process.env.DATABASE_URL!, { relations });

export const countWhere = <T>(condition: SQL<T>) =>
  sql<number>`COUNT(*) FILTER (WHERE ${condition})`;

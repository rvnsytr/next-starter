import * as schema from "@/config/db.schema";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas.db";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

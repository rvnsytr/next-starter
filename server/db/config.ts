import { drizzle } from "drizzle-orm/node-postgres";

import * as auth from "@/server/db/schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    ...auth,
  },
});

import { drizzle } from "drizzle-orm/node-postgres";
import { PgSelect } from "drizzle-orm/pg-core";
import { DataTableState } from "./components/ui/data-table";
import * as schema from "./schema.db";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export function withPagination<T extends PgSelect>(
  qb: T,
  pgnt: DataTableState["pagination"],
) {
  return qb
    .limit(pgnt.pageSize)
    .offset(pgnt.pageIndex * pgnt.pageSize)
    .$dynamic();
}

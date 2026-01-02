import { asc, desc, ilike, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { AnyPgColumn, PgSelect } from "drizzle-orm/pg-core";
import { DataTableState } from "./components/ui/data-table";
import * as schema from "./schema.db";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export function withDataTable<T extends PgSelect>(
  qb: T,
  state: DataTableState,
  config: {
    sorting: {
      default: { column: AnyPgColumn; desc: boolean };
      columns: { id: string; column: AnyPgColumn }[];
    };
    globalFilter: {
      columns: AnyPgColumn[];
    };
  },
) {
  const { pagination, sorting, globalFilter } = state;

  if (globalFilter)
    qb = qb.where(
      or(
        ...config.globalFilter.columns.map((c) =>
          ilike(c, `%${globalFilter}%`),
        ),
      ),
    );

  if (sorting.length) {
    sorting.forEach(({ id, desc: isDesc }) => {
      const meta = config.sorting.columns.find((c) => c.id === id);
      if (!meta) return;
      qb = qb.orderBy(isDesc ? desc(meta.column) : asc(meta.column));
    });
  } else {
    const { column, desc: isDesc } = config.sorting.default;
    qb = qb.orderBy(isDesc ? desc(column) : asc(column));
  }

  qb = qb
    .limit(pagination.pageSize)
    .offset(pagination.pageIndex * pagination.pageSize);

  return qb;
}

import { asc, desc, ilike, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { AnyPgColumn, PgSelect } from "drizzle-orm/pg-core";
import { DataTableState } from "./components/ui/data-table";
import * as schema from "./schema.db";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export type WithDataTableConfig = {
  disabled?: ("pagination" | "sorting" | "globalFilter")[];
  globalFilter: {
    columns: AnyPgColumn[];
  };
  sorting: {
    default: { column: AnyPgColumn; desc: boolean };
    columns: { id: string; column: AnyPgColumn }[];
  };
};

export function withDataTable<T extends PgSelect>(
  qb: T,
  state: DataTableState,
  config: WithDataTableConfig,
) {
  const { disabled, sorting, globalFilter } = config;

  // * Global Filter
  if (!disabled?.includes("globalFilter") && state.globalFilter)
    qb = qb.where(
      or(
        ...globalFilter.columns.map((c) => ilike(c, `%${state.globalFilter}%`)),
      ),
    );

  // * Sorting
  if (!disabled?.includes("sorting"))
    if (state.sorting.length) {
      state.sorting.forEach(({ id, desc: isDesc }) => {
        const meta = sorting.columns.find((c) => c.id === id);
        if (!meta) return;
        qb = qb.orderBy(isDesc ? desc(meta.column) : asc(meta.column));
      });
    } else {
      const { column, desc: isDesc } = sorting.default;
      qb = qb.orderBy(isDesc ? desc(column) : asc(column));
    }

  // * Pagination
  if (!disabled?.includes("pagination"))
    qb = qb
      .limit(state.pagination.pageSize)
      .offset(state.pagination.pageIndex * state.pagination.pageSize);

  return qb;
}

import { asc, desc, ilike, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { AnyPgColumn, PgSelect } from "drizzle-orm/pg-core";
import { DataTableState } from "./components/ui/data-table";
import * as schema from "./schema.db";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

type WDTConfigColumns<I extends string = string> = Record<I, AnyPgColumn>;

export type WDTConfig<TColumns extends WDTConfigColumns> = {
  disabled?: ("globalFilter" | "columnFilter" | "sorting" | "pagination")[];
  columns: TColumns;
  globalFilterBy?: (keyof TColumns)[];
  defaultOrderBy?: { id: keyof TColumns; desc: boolean };
};

export const defineWDTConfig = <T extends WDTConfigColumns>(
  config: WDTConfig<T>,
) => config;

export function withDataTable<
  TQueryBuilder extends PgSelect,
  TConfig extends WDTConfigColumns,
>(qb: TQueryBuilder, state: DataTableState, config: WDTConfig<TConfig>) {
  const { disabled, columns, globalFilterBy, defaultOrderBy } = config;

  // * Global Filter
  if (
    !disabled?.includes("globalFilter") &&
    state.globalFilter &&
    globalFilterBy
  ) {
    const conditions = globalFilterBy.map((id) =>
      ilike(columns[id], `%${state.globalFilter}%`),
    );

    qb = qb.where(or(...conditions));
  }

  // TODO: Column Filters
  if (!disabled?.includes("columnFilter") && state.columnFilters)
    state.columnFilters.forEach(() => {});

  // * Sorting
  if (!disabled?.includes("sorting"))
    if (state.sorting.length) {
      state.sorting.forEach(({ id, desc: isDesc }) => {
        qb = qb.orderBy(isDesc ? desc(columns[id]) : asc(columns[id]));
      });
    } else if (defaultOrderBy) {
      const { id, desc: isDesc } = defaultOrderBy;
      qb = qb.orderBy(isDesc ? desc(columns[id]) : asc(columns[id]));
    }

  // * Pagination
  if (!disabled?.includes("pagination"))
    qb = qb
      .limit(state.pagination.pageSize)
      .offset(state.pagination.pageIndex * state.pagination.pageSize);

  return qb;
}

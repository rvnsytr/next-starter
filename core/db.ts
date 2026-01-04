import { and, asc, desc, ilike, not, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { AnyPgColumn, PgSelect } from "drizzle-orm/pg-core";
import { DataTableState } from "./components/ui/data-table";
import * as schema from "./schema.db";
import { FilterOperators } from "./utils";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

type WDTConfigColumns<I extends string = string> = Record<I, AnyPgColumn>;

export type WDTConfig<Columns extends WDTConfigColumns> = {
  disabled?: ("globalFilter" | "columnFilter" | "sorting" | "pagination")[];
  columns: Columns;
  globalFilterBy?: (keyof Columns)[];
  defaultOrderBy?: { id: keyof Columns; desc: boolean };
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
    const conditions = globalFilterBy
      .map((id) => {
        const col = columns[id] ?? null;
        if (!col) return null;
        return ilike(col, `%${state.globalFilter}%`);
      })
      .filter((v) => !!v);

    if (conditions.length) qb = qb.where(or(...conditions));
  }

  // TODO: Column Filters
  if (!disabled?.includes("columnFilter") && state.columnFilters) {
    const ilikeOp: FilterOperators[] = ["contains"];

    const notIlikeOp: FilterOperators[] = ["does not contain"];

    const conditions = state.columnFilters
      .map(({ id, value: { operator, values } }) => {
        const col = columns[id] ?? null;
        if (!col) return null;

        if (ilikeOp.includes(operator)) return ilike(col, `%${values[0]}%`);
        if (notIlikeOp.includes(operator))
          return not(ilike(col, `%${values[0]}%`));

        return null;
      })
      .filter((v) => !!v);

    if (conditions.length) qb = qb.where(and(...conditions));
  }

  // * Sorting
  if (!disabled?.includes("sorting")) {
    const sortingHandler = () => {
      if (state.sorting.length) {
        const conditions = state.sorting
          .map(({ id, desc: isDesc }) => {
            const col = columns[id] ?? null;
            if (!col) return null;
            return isDesc ? desc(col) : asc(col);
          })
          .filter((v) => !!v);

        if (conditions.length) return (qb = qb.orderBy(...conditions));
      }

      if (defaultOrderBy) {
        const { id, desc: isDesc } = defaultOrderBy;
        qb = qb.orderBy(isDesc ? desc(columns[id]) : asc(columns[id]));
      }
    };

    sortingHandler();
  }

  // * Pagination
  if (!disabled?.includes("pagination"))
    qb = qb
      .limit(state.pagination.pageSize)
      .offset(state.pagination.pageIndex * state.pagination.pageSize);

  return qb;
}

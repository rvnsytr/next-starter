import { isValid } from "date-fns";
import {
  and,
  asc,
  between,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  ne,
  not,
  notBetween,
  notIlike,
  notInArray,
  or,
} from "drizzle-orm";
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
  columnFilterParser?: ({ id: keyof Columns } & (
    | { type: "number" | "date" }
    | {
        type: "boolean";
        condition?: (value: string | number | Date) => boolean;
      }
  ))[];
  defaultOrderBy?: { id: keyof Columns; desc: boolean };
};

export const defineWDTConfig = <T extends WDTConfigColumns>(
  config: WDTConfig<T>,
) => config;

export function withDataTable<
  TQueryBuilder extends PgSelect,
  TConfig extends WDTConfigColumns,
>(qb: TQueryBuilder, state: DataTableState, config: WDTConfig<TConfig>) {
  // * Global Filter
  if (
    !config.disabled?.includes("globalFilter") &&
    state.globalFilter &&
    config.globalFilterBy
  ) {
    const conditions = config.globalFilterBy
      .map((id) => {
        const col = config.columns[id] ?? null;
        if (!col) return null;
        return ilike(col, `%${state.globalFilter}%`);
      })
      .filter((v) => !!v);

    if (conditions.length) qb = qb.where(or(...conditions));
  }

  // * Column Filters
  if (!config.disabled?.includes("columnFilter") && state.columnFilters) {
    const ilikeOp: FilterOperators[] = ["contains"];
    const notIlikeOp: FilterOperators[] = ["does not contain"];

    const eqOp: FilterOperators[] = ["is"];
    const notEqOp: FilterOperators[] = ["is not"];

    const ltOp: FilterOperators[] = ["is less than", "is before"];
    const lteOp: FilterOperators[] = [
      "is less than or equal to",
      "is on or before",
    ];
    const gtOp: FilterOperators[] = ["is greater than", "is after"];
    const gteOp: FilterOperators[] = [
      "is greater than or equal to",
      "is on or after",
    ];

    const betweenOp: FilterOperators[] = ["is between"];
    const notBetweenOp: FilterOperators[] = ["is not between"];

    const inArrayOp: FilterOperators[] = [
      "is any of",
      "include",
      "include any of",
    ];
    const notInArrayOp: FilterOperators[] = [
      "is none of",
      "exclude",
      "exclude if any of",
    ];

    const includeIfAllOp: FilterOperators[] = ["include all of"];
    const excludeIfAllOp: FilterOperators[] = ["exclude if all"];

    const conditions = state.columnFilters
      .map(({ id, value: { operator, values } }) => {
        const col = config.columns[id];
        if (!col || !values.length) return null;

        let parsedValues: (string | number | boolean | Date)[] = values;

        const withParse = config.columnFilterParser?.find((v) => v.id === id);
        if (withParse) {
          if (withParse.type === "date")
            parsedValues = values
              .map((v) => {
                const d = v instanceof Date ? v : new Date(v);
                if (!isValid(d)) return null;
                return d;
              })
              .filter((v) => !!v);

          if (withParse.type === "number")
            parsedValues = values
              .map((v) => {
                const n = Number(v);
                if (isNaN(n)) return null;
                return n;
              })
              .filter((v) => v !== null);

          if (withParse.type === "boolean")
            parsedValues = values // string[]
              .map((v) => {
                if (withParse.condition) return withParse.condition(v);
                if (typeof v !== "string") return null;
                const n = v.toLowerCase();
                if (n === "true" || v === "1") return true;
                if (n === "false" || v === "0") return false;
                return null;
              })
              .filter((v) => v !== null);
        }

        if (!parsedValues.length) return null;

        if (ilikeOp.includes(operator))
          return ilike(col, `%${parsedValues[0]}%`);
        if (notIlikeOp.includes(operator))
          return notIlike(col, `%${parsedValues[0]}%`);

        if (eqOp.includes(operator)) return eq(col, parsedValues[0]);
        if (notEqOp.includes(operator)) return ne(col, parsedValues[0]);

        if (ltOp.includes(operator)) return lt(col, parsedValues[0]);
        if (lteOp.includes(operator)) return lte(col, parsedValues[0]);
        if (gtOp.includes(operator)) return gt(col, parsedValues[0]);
        if (gteOp.includes(operator)) return gte(col, parsedValues[0]);

        if (betweenOp.includes(operator)) {
          if (parsedValues.length < 2) return null;
          return between(col, parsedValues[0], parsedValues[1]);
        }
        if (notBetweenOp.includes(operator)) {
          if (parsedValues.length < 2) return null;
          return notBetween(col, parsedValues[0], parsedValues[1]);
        }

        if (inArrayOp.includes(operator)) {
          if (!parsedValues.length) return null;
          return inArray(col, parsedValues);
        }
        if (notInArrayOp.includes(operator)) {
          if (!parsedValues.length) return null;
          return notInArray(col, parsedValues);
        }

        if (includeIfAllOp.includes(operator))
          return and(...parsedValues.map((v) => eq(col, v)));
        if (excludeIfAllOp.includes(operator)) {
          const clauses = parsedValues.map((v) => eq(col, v));
          if (!clauses.length) return null;
          const combined = and(...clauses);
          if (!combined) return null;
          return not(combined);
        }

        return null;
      })
      .filter((v) => !!v);

    if (conditions.length) qb = qb.where(and(...conditions));
  }

  // * Sorting
  if (!config.disabled?.includes("sorting")) {
    const sortingHandler = () => {
      if (state.sorting.length) {
        const conditions = state.sorting
          .map(({ id, desc: isDesc }) => {
            const col = config.columns[id] ?? null;
            if (!col) return null;
            return isDesc ? desc(col) : asc(col);
          })
          .filter((v) => !!v);

        if (conditions.length) return (qb = qb.orderBy(...conditions));
      }

      if (config.defaultOrderBy) {
        const { id, desc: isDesc } = config.defaultOrderBy;
        const col = config.columns[id] ?? null;
        if (!col) return null;
        qb = qb.orderBy(isDesc ? desc(col) : asc(col));
      }
    };

    sortingHandler();
  }

  // * Pagination
  if (!config.disabled?.includes("pagination"))
    qb = qb
      .limit(state.pagination.pageSize)
      .offset(state.pagination.pageIndex * state.pagination.pageSize);

  return qb;
}

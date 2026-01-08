import { isValid } from "date-fns";
import {
  and,
  arrayContains,
  arrayOverlaps,
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
import { AnyPgColumn, PgSelect } from "drizzle-orm/pg-core";
import { DataTableState } from "./components/ui/data-table";
import { FilterOperators } from "./filter";

type WDTConfigColumns<I extends string = string> = Record<I, AnyPgColumn>;

export type WDTConfig<Columns extends WDTConfigColumns> = {
  disabled?: ("globalFilter" | "columnFilters" | "sorting" | "pagination")[];
  columns: Columns;
  globalFilter?: (keyof Columns)[];
  columnFilterParser?: ({ id: keyof Columns } & (
    | { type: "number" | "date" }
    | {
        type: "boolean";
        condition?: (value: string | number | Date) => boolean;
      }
  ))[];
  defaultOrder?: { id: keyof Columns; desc: boolean };
};

export const defineWDTConfig = <TColumns extends WDTConfigColumns>(
  config: WDTConfig<TColumns>,
) => config;

export function withDataTable<
  TQueryBuilder extends PgSelect,
  TColumns extends WDTConfigColumns,
>(qb: TQueryBuilder, state: DataTableState, config: WDTConfig<TColumns>) {
  // * Global Filter
  if (
    !config.disabled?.includes("globalFilter") &&
    state.globalFilter &&
    config.globalFilter
  ) {
    const conditions = config.globalFilter
      .map((id) => {
        const col = config.columns[id] ?? null;
        if (!col) return null;
        return ilike(col, `%${state.globalFilter}%`);
      })
      .filter((v) => !!v);

    if (conditions.length) qb = qb.where(or(...conditions));
  }

  // * Column Filters
  if (!config.disabled?.includes("columnFilters") && state.columnFilters) {
    const ilikeOperators: FilterOperators[] = ["contains"];
    const notIlikeOperators: FilterOperators[] = ["does not contain"];

    const eqOperators: FilterOperators[] = ["is"];
    const notEqOperators: FilterOperators[] = ["is not"];

    const ltOperators: FilterOperators[] = ["is less than", "is before"];
    const lteOperators: FilterOperators[] = [
      "is less than or equal to",
      "is on or before",
    ];
    const gtOperators: FilterOperators[] = ["is greater than", "is after"];
    const gteOperators: FilterOperators[] = [
      "is greater than or equal to",
      "is on or after",
    ];

    const betweenOperators: FilterOperators[] = ["is between"];
    const notBetweenOperators: FilterOperators[] = ["is not between"];

    const inArrayOperators: FilterOperators[] = ["is any of"];
    const notInArrayOperators: FilterOperators[] = ["is none of"];

    const includeAnyOperators: FilterOperators[] = [
      "include",
      "include any of",
    ];
    const excludeAnyOperators: FilterOperators[] = [
      "exclude",
      "exclude if any of",
    ];
    const includeAllOperators: FilterOperators[] = ["include all of"];
    const excludeAllOperators: FilterOperators[] = ["exclude if all"];

    const conditions = state.columnFilters
      .map(({ id, value: { operator, values } }) => {
        const col = config.columns[id];
        if (!col || !values.length) return null;

        let parsedValues: (string | number | boolean | Date)[] = values;

        const parser = config.columnFilterParser?.find((v) => v.id === id);
        if (parser) {
          if (parser.type === "date")
            parsedValues = values
              .map((v) => {
                const d = v instanceof Date ? v : new Date(v);
                if (!isValid(d)) return null;
                return d;
              })
              .filter((v) => !!v);

          if (parser.type === "number")
            parsedValues = values
              .map((v) => {
                const n = Number(v);
                if (isNaN(n)) return null;
                return n;
              })
              .filter((v) => v !== null);

          if (parser.type === "boolean")
            parsedValues = values
              .map((v) => {
                if (parser.condition) return parser.condition(v);
                if (typeof v !== "string") return null;
                const n = v.trim().toLowerCase();
                if (n === "true" || v === "1") return true;
                if (n === "false" || v === "0") return false;
                return null;
              })
              .filter((v) => v !== null);
        }

        if (!parsedValues.length) return null;

        if (ilikeOperators.includes(operator))
          return ilike(col, `%${parsedValues[0]}%`);
        if (notIlikeOperators.includes(operator))
          return notIlike(col, `%${parsedValues[0]}%`);

        if (eqOperators.includes(operator)) return eq(col, parsedValues[0]);
        if (notEqOperators.includes(operator)) return ne(col, parsedValues[0]);

        if (ltOperators.includes(operator)) return lt(col, parsedValues[0]);
        if (lteOperators.includes(operator)) return lte(col, parsedValues[0]);
        if (gtOperators.includes(operator)) return gt(col, parsedValues[0]);
        if (gteOperators.includes(operator)) return gte(col, parsedValues[0]);

        if (betweenOperators.includes(operator)) {
          if (parsedValues.length < 2) return null;
          return between(col, parsedValues[0], parsedValues[1]);
        }
        if (notBetweenOperators.includes(operator)) {
          if (parsedValues.length < 2) return null;
          return notBetween(col, parsedValues[0], parsedValues[1]);
        }

        if (inArrayOperators.includes(operator))
          return inArray(col, parsedValues);
        if (notInArrayOperators.includes(operator))
          return notInArray(col, parsedValues);

        if (includeAnyOperators.includes(operator))
          return arrayOverlaps(col, parsedValues);
        if (excludeAnyOperators.includes(operator))
          return not(arrayOverlaps(col, parsedValues));
        if (includeAllOperators.includes(operator))
          return arrayContains(col, parsedValues);
        if (excludeAllOperators.includes(operator))
          return not(arrayContains(col, parsedValues));

        return null;
      })
      .filter((v) => !!v);

    if (conditions.length) qb = qb.where(and(...conditions));
  }

  // * Sorting
  if (!config.disabled?.includes("sorting")) {
    const applySorting = () => {
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

      if (config.defaultOrder) {
        const { id, desc: isDesc } = config.defaultOrder;
        const col = config.columns[id];
        qb = qb.orderBy(isDesc ? desc(col) : asc(col));
      }
    };

    applySorting();
  }

  // * Pagination
  if (!config.disabled?.includes("pagination")) {
    const { pageIndex, pageSize } = state.pagination;
    qb = qb.limit(pageSize).offset(pageIndex * pageSize);
  }

  return qb;
}

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

type ConfigParserValue = string | number | Date;

type WDTColumnConfig = { column: AnyPgColumn } & (
  | { type: "string"; parser?: (value: ConfigParserValue) => string }
  | { type: "number"; parser?: (value: ConfigParserValue) => number }
  | { type: "date"; parser?: (value: ConfigParserValue) => Date }
  | { type: "boolean"; parser: (value: ConfigParserValue) => boolean }
);

type WDTConfig<Columns extends Record<string, WDTColumnConfig>> = {
  disabled?: ("globalFilter" | "columnFilters" | "sorting" | "pagination")[];
  columns: Columns;
  defaultOrder?: { id: keyof Columns; desc: boolean };
};

export const defineWDTConfig = <
  Columns extends Record<string, WDTColumnConfig>,
>(
  config: WDTConfig<Columns>,
) => config;

export function withDataTable<
  TQueryBuilder extends PgSelect,
  Columns extends Record<string, WDTColumnConfig>,
>(qb: TQueryBuilder, state: DataTableState, config: WDTConfig<Columns>) {
  // #region Global Filter
  const columnValues = Object.values(config.columns);
  const globalFilterCols = columnValues.filter((v) => v.type === "string");
  if (
    !config.disabled?.includes("globalFilter") &&
    state.globalFilter &&
    globalFilterCols.length
  ) {
    const value = `%${state.globalFilter}%`;
    const conditions = globalFilterCols.map((v) => ilike(v.column, value));
    if (conditions.length) qb = qb.where(or(...conditions));
  }
  // #endregion

  // #region Column Filters
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
        const columnConfig = config.columns[id];
        if (!columnConfig || !values.length) return null;

        const { column, type, parser } = columnConfig;
        let parsedValues: (string | number | boolean | Date)[] = values;

        if (type === "date")
          parsedValues = values
            .map((v) => {
              const d = v instanceof Date ? v : new Date(v);
              if (!isValid(d)) return null;
              return d;
            })
            .filter((v) => !!v);

        if (type === "number")
          parsedValues = values
            .map((v) => {
              const n = Number(v);
              if (isNaN(n)) return null;
              return n;
            })
            .filter((v) => v !== null);

        if (type === "boolean")
          parsedValues = values
            .map((v) => {
              if (parser) return parser(v);
              if (typeof v !== "string") return null;
              const n = v.trim().toLowerCase();
              if (n === "true" || v === "1") return true;
              if (n === "false" || v === "0") return false;
              return null;
            })
            .filter((v) => v !== null);

        if (!parsedValues.length) return null;

        if (ilikeOperators.includes(operator))
          return ilike(column, `%${parsedValues[0]}%`);
        if (notIlikeOperators.includes(operator))
          return notIlike(column, `%${parsedValues[0]}%`);

        if (eqOperators.includes(operator)) return eq(column, parsedValues[0]);
        if (notEqOperators.includes(operator))
          return ne(column, parsedValues[0]);

        if (ltOperators.includes(operator)) return lt(column, parsedValues[0]);
        if (lteOperators.includes(operator))
          return lte(column, parsedValues[0]);
        if (gtOperators.includes(operator)) return gt(column, parsedValues[0]);
        if (gteOperators.includes(operator))
          return gte(column, parsedValues[0]);

        if (betweenOperators.includes(operator)) {
          if (parsedValues.length < 2) return null;
          return between(column, parsedValues[0], parsedValues[1]);
        }
        if (notBetweenOperators.includes(operator)) {
          if (parsedValues.length < 2) return null;
          return notBetween(column, parsedValues[0], parsedValues[1]);
        }

        if (inArrayOperators.includes(operator))
          return inArray(column, parsedValues);
        if (notInArrayOperators.includes(operator))
          return notInArray(column, parsedValues);

        if (includeAnyOperators.includes(operator))
          return arrayOverlaps(column, parsedValues);
        if (excludeAnyOperators.includes(operator))
          return not(arrayOverlaps(column, parsedValues));
        if (includeAllOperators.includes(operator))
          return arrayContains(column, parsedValues);
        if (excludeAllOperators.includes(operator))
          return not(arrayContains(column, parsedValues));

        return null;
      })
      .filter((v) => !!v);

    if (conditions.length) qb = qb.where(and(...conditions));
  }
  // #endregion

  // #region Sorting
  if (!config.disabled?.includes("sorting")) {
    const applySorting = () => {
      if (state.sorting.length) {
        const conditions = state.sorting
          .map(({ id, desc: isDesc }) => {
            const columnConfig = config.columns[id] ?? null;
            if (!columnConfig) return null;
            const { column } = columnConfig;
            return isDesc ? desc(column) : asc(column);
          })
          .filter((v) => !!v);

        if (conditions.length) return (qb = qb.orderBy(...conditions));
      }

      if (config.defaultOrder) {
        const { id, desc: isDesc } = config.defaultOrder;
        const { column } = config.columns[id];
        qb = qb.orderBy(isDesc ? desc(column) : asc(column));
      }
    };

    applySorting();
  }
  // #endregion

  // #region Pagination
  if (!config.disabled?.includes("pagination")) {
    const { pageIndex, pageSize } = state.pagination;
    qb = qb.limit(pageSize).offset(pageIndex * pageSize);
  }
  // #endregion

  return qb;
}

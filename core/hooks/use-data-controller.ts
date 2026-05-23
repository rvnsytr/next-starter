"use client";

import {
  ColumnDef as ColumnDefType,
  ColumnPinningState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
  Table,
  TableOptions,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { isValid } from "date-fns";
import {
  createParser,
  parseAsArrayOf,
  parseAsIndex,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useMemo, useState } from "react";
import useSWR, { mutate, SWRConfiguration, SWRResponse } from "swr";
import z from "zod";
import { DataControllerState } from "../data-controller";
import { ActionResponse, ActionSuccess, Override } from "../types";
import {
  allDataFilterType,
  allFilterOperators,
  formatLocalizedDate,
  parseLocalizedDate,
} from "../utils";
import { useDebounce } from "./use-debounce";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ColumnDef<TData> = ColumnDefType<TData, any>[];

export type AllDataControllerState = DataControllerState & {
  columnPinning: ColumnPinningState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
};

export type DataControllerQueryConfig<TData> = Override<
  SWRConfiguration,
  { fallbackData?: ActionSuccess<TData[]> }
>;

export type DataControllerResult<TData> = SWRResponse<ActionSuccess<TData[]>>;

export type DataControllerOptions<TData> = Pick<
  TableOptions<TData>,
  "getRowId" | "enableRowSelection"
> & {
  mode?: "auto" | "manual";
  columns:
    | ColumnDef<TData>
    | ((result?: DataControllerResult<TData>) => ColumnDef<TData>);
  query: {
    key: string;
    fetcher: (state: DataControllerState) => Promise<ActionResponse<TData[]>>;
    config?: DataControllerQueryConfig<TData>;
    immutable?: boolean;
  };
  defaultState?: Partial<AllDataControllerState>;
};

type StatelessDataControllerOptions<TData> = DataControllerOptions<TData> & {
  state: {
    [K in keyof AllDataControllerState]: [
      AllDataControllerState[K],
      OnChangeFn<AllDataControllerState[K]>,
    ];
  };
};

export type DataControllerResponse<TData> = {
  result: DataControllerResult<TData>;
  table: Table<TData>;
  columns: ColumnDef<TData>;
};

export const pageSizes = [5, 10, 20, 30, 40, 50, 100];
export const defaultPageSize = pageSizes[1];

export const mutateControlledData = (key: string) =>
  mutate((arg) => Array.isArray(arg) && arg[0] === key);

export function useStatelessDataController<TData>({
  mode,
  columns,
  query,

  state: {
    globalFilter: [globalFilter, setGlobalFilter],
    pagination: [pagination, setPagination],
    sorting: [sorting, setSorting],
    columnFilters: [columnFilters, setColumnFilters],
    columnPinning: [columnPinning, setColumnPinning],
    columnVisibility: [columnVisibility, setColumnVisibility],
    rowSelection: [rowSelection, setRowSelection],
  },

  getRowId,
  enableRowSelection,
}: StatelessDataControllerOptions<TData>): DataControllerResponse<TData> {
  const debouncedSearch = useDebounce(globalFilter);

  const state: DataControllerState = useMemo(
    () => ({
      globalFilter: debouncedSearch,
      pagination: pagination,
      sorting: sorting,
      columnFilters: columnFilters,
    }),
    [debouncedSearch, pagination, sorting, columnFilters],
  );

  const result = useSWR<ActionSuccess<TData[]>>(
    mode === "manual" ? [query.key, state] : [query.key],
    async () => {
      const res = await query.fetcher(state);
      if (!res.success) throw res;
      return res;
    },
    {
      ...query.config,
      revalidateIfStale:
        query.config?.revalidateIfStale ?? (query.immutable ? false : true),
      revalidateOnFocus:
        query.config?.revalidateOnFocus ?? (query.immutable ? false : true),
      revalidateOnReconnect:
        query.config?.revalidateOnReconnect ?? (query.immutable ? false : true),
    },
  );

  const resolvedColumns = useMemo(() => {
    if (typeof columns !== "function") return columns;
    return columns(result);
  }, [columns, result]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: resolvedColumns,
    data: result.data?.data ?? [],

    state: {
      globalFilter,
      pagination,
      sorting,
      columnFilters,
      columnPinning,
      columnVisibility,
      rowSelection,
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: mode === "auto" ? getFilteredRowModel() : undefined,

    // * Global Searching
    manualFiltering: mode === "manual",
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,

    // * Pagination
    manualPagination: mode === "manual",
    rowCount: mode === "manual" ? (result.data?.count?.total ?? 0) : undefined,
    onPaginationChange: setPagination,
    getPaginationRowModel:
      mode === "auto" ? getPaginationRowModel() : undefined,

    // * Column Sorting
    manualSorting: mode === "manual",
    onSortingChange: setSorting,
    getSortedRowModel: mode === "auto" ? getSortedRowModel() : undefined,

    // * Column Filtering
    onColumnFiltersChange: setColumnFilters,

    // ? Column Faceting
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // ? Column Pinning
    onColumnPinningChange: setColumnPinning,

    // ? Column Visibility
    onColumnVisibilityChange: setColumnVisibility,

    // ? Row Selection
    getRowId,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
  });

  return { result, table, columns: resolvedColumns };
}

export function useDataController<TData>({
  defaultState,
  ...props
}: DataControllerOptions<TData>) {
  const globalFilter = useState<string>(defaultState?.globalFilter ?? "");

  const pagination = useState<DataControllerState["pagination"]>({
    pageIndex: defaultState?.pagination?.pageIndex ?? 0,
    pageSize: defaultState?.pagination?.pageSize ?? defaultPageSize,
  });

  const sorting = useState<DataControllerState["sorting"]>(
    defaultState?.sorting ?? [],
  );

  const columnFilters = useState<DataControllerState["columnFilters"]>(
    defaultState?.columnFilters ?? [],
  );

  const columnPinning = useState<ColumnPinningState>({
    left: defaultState?.columnPinning?.left ?? [],
    right: defaultState?.columnPinning?.right ?? [],
  });

  const columnVisibility = useState<VisibilityState>(
    defaultState?.columnVisibility ?? {},
  );

  const rowSelection = useState<RowSelectionState>(
    defaultState?.rowSelection ?? {},
  );

  return useStatelessDataController({
    ...props,
    state: {
      globalFilter,
      pagination,
      sorting,
      columnFilters,
      columnPinning,
      columnVisibility,
      rowSelection,
    },
  });
}

// #region Query Parsers

const getSortingParser = (defaultValue: DataControllerState["sorting"]) =>
  createParser<DataControllerState["sorting"]>({
    parse: (value) => {
      if (!value) return defaultValue;
      return value
        .split(";")
        .map((part) => {
          const idx = part.indexOf(":");
          if (idx === -1) return null;

          const id = part.slice(0, idx).trim();
          const rawDir = part.slice(idx + 1).trim();

          if (!id || !rawDir) return null;

          const parsed = z.enum(["asc", "desc"]).safeParse(rawDir);
          if (!id || !parsed.success) return null;
          return { id, desc: parsed.data === "desc" };
        })
        .filter((v) => v !== null);
    },
    serialize: (value) => {
      if (!value?.length) return null as unknown as string;
      return value.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(";");
    },
  }).withDefault(defaultValue);

const getRecordParser = (
  recordValue: boolean,
  defaultValue: Record<string, boolean>,
) =>
  createParser<Record<string, boolean>>({
    parse: (value) => {
      if (!value) return defaultValue;
      return Object.fromEntries(
        value
          .split(",")
          .filter(Boolean)
          .map((v) => [v.trim(), recordValue]),
      );
    },
    serialize: (value) => {
      const entries = Object.entries(value);
      if (!entries?.length) return null as unknown as string;
      const serialized = entries
        .map(([k, v]) => (v === recordValue ? k : null))
        .filter((v) => !!v)
        .join(",");
      return serialized || (null as unknown as string);
    },
  }).withDefault(defaultValue);

const columnFiltersValueSchema = z.object({
  operator: z.enum(allFilterOperators),
  values: z
    .union([
      z.string(),
      z.number(),
      z.coerce.date(),
      z.union([z.string(), z.number(), z.coerce.date()]).array(),
    ])
    .array(),
  columnMeta: z.object({
    label: z.string(),
    type: z.enum(allDataFilterType),
  }),
});

function getColumnFiltersParser(
  defaultValue: DataControllerState["columnFilters"],
) {
  return createParser<DataControllerState["columnFilters"]>({
    parse: (value) => {
      if (!value) return defaultValue;
      return value
        .split(";")
        .map((part) => {
          /**
           * format:
           * type:id:operator:values
           *
           * example:
           * date:createdAt:is:20250101T0000
           */

          const first = part.indexOf(":");
          const second = part.indexOf(":", first + 1);
          const third = part.indexOf(":", second + 1);

          if (first === -1 || second === -1 || third === -1) return null;

          const rawType = part.slice(0, first);
          const id = part.slice(first + 1, second);
          const rawOperator = part.slice(second + 1, third);
          const rawValues = part.slice(third + 1);

          if (!rawType || !id || !rawOperator || !rawValues) return null;

          const parsedType = z.enum(allDataFilterType).safeParse(rawType);
          if (!parsedType.success) return null;

          const parsedOperator = z
            .enum(allFilterOperators)
            .safeParse(rawOperator);
          if (!parsedOperator.success) return null;

          const type = parsedType.data;
          const operator = parsedOperator.data;

          const values = rawValues
            .split(",")
            .map((v) => {
              switch (type) {
                case "date": {
                  const d = parseLocalizedDate(v, "yyyyMMdd'T'HHmm");
                  return isValid(d) ? d : null;
                }

                case "number": {
                  const n = Number(v);
                  return Number.isNaN(n) ? null : n;
                }

                default:
                  return v;
              }
            })
            .filter((v) => !!v);

          if (!values.length) return null;

          return { id, value: { operator, values } };
        })
        .filter((v) => v !== null);
    },
    serialize: (value) => {
      if (!value?.length) return null as unknown as string;

      const query = value
        .map(({ id, value: rawValue }) => {
          const parsed = columnFiltersValueSchema.safeParse(rawValue);
          if (!parsed.success) return "";

          const { operator, values, columnMeta } = parsed.data;

          const serializedValues = values.map((v) =>
            v instanceof Date
              ? formatLocalizedDate(v, "yyyyMMdd'T'HHmm")
              : String(v),
          );

          return [
            columnMeta.type,
            id,
            operator,
            serializedValues.join(","),
          ].join(":");
        })
        .filter(Boolean);

      if (!query.length) return null as unknown as string;
      return query.join(";");
    },
  }).withDefault(defaultValue);
}

// #endregion

export type QueryDataControllerOptions<TData> = DataControllerOptions<TData> & {
  prefix?: string;
  suffix?: string;
};

export function useQueryDataController<TData>({
  prefix = "",
  suffix = "",

  defaultState,
  ...props
}: QueryDataControllerOptions<TData>) {
  const globalFilter = useQueryState<string>(
    `${prefix}search${suffix}`,
    parseAsString.withDefault(defaultState?.globalFilter ?? ""),
  );

  const pagination = useQueryStates(
    {
      pageIndex: parseAsIndex.withDefault(
        defaultState?.pagination?.pageIndex ?? 0,
      ),
      pageSize: parseAsInteger.withDefault(
        defaultState?.pagination?.pageSize ?? defaultPageSize,
      ),
    },
    {
      urlKeys: {
        pageIndex: `${prefix}page${suffix}`,
        pageSize: `${prefix}size${suffix}`,
      },
    },
  );

  const sorting = useQueryState(
    `${prefix}sort${suffix}`,
    getSortingParser(defaultState?.sorting ?? []),
  );

  const columnFilters = useQueryState(
    `${prefix}filter${suffix}`,
    getColumnFiltersParser(defaultState?.columnFilters ?? []),
  );

  const columnPinning = useQueryStates(
    {
      left: parseAsArrayOf(parseAsString).withDefault(
        defaultState?.columnPinning?.left ?? [],
      ),
      right: parseAsArrayOf(parseAsString).withDefault(
        defaultState?.columnPinning?.right ?? [],
      ),
    },
    {
      urlKeys: {
        left: `${prefix}left${suffix}`,
        right: `${prefix}right${suffix}`,
      },
    },
  );

  const columnVisibility = useQueryState(
    `${prefix}hidden${suffix}`,
    getRecordParser(false, defaultState?.columnVisibility ?? {}),
  );

  const rowSelection = useQueryState(
    `${prefix}selected`,
    getRecordParser(true, defaultState?.rowSelection ?? {}),
  );

  return useStatelessDataController({
    ...props,
    state: {
      globalFilter,
      pagination,
      sorting,
      columnFilters,
      columnPinning,
      columnVisibility,
      rowSelection,
    },
  });
}

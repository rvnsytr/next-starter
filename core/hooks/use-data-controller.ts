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
import { ActionResponse } from "../types";
import {
  allFilterOperators,
  formatLocalizedDate,
  parseLocalizedDate,
} from "../utils";
import { useDebounce } from "./use-debounce";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ColumnDef<TData> = ColumnDefType<TData, any>[];
type AllDataControllerState = DataControllerState & {
  columnPinning: ColumnPinningState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
};

export type DataControllerOptions<TData> = Pick<
  TableOptions<TData>,
  "getRowId" | "enableRowSelection"
> & {
  mode?: "auto" | "manual";
  columns:
    | ColumnDef<TData>
    | ((context?: SWRResponse<ActionResponse<TData[]>>) => ColumnDef<TData>);
  query: {
    key: string;
    fetcher: (state: DataControllerState) => Promise<ActionResponse<TData[]>>;
    config?: SWRConfiguration;
  } & ({ immutable: true } | { immutable?: false; revalidate?: boolean });

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
  result: SWRResponse<ActionResponse<TData[]>>;
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

  const queryState: DataControllerState = useMemo(
    () => ({
      globalFilter: debouncedSearch,
      pagination: pagination,
      sorting: sorting,
      columnFilters: columnFilters,
    }),
    [debouncedSearch, pagination, sorting, columnFilters],
  );

  const shouldRevalidate = !query.immutable && (query.revalidate ?? true);
  const result = useSWR<ActionResponse<TData[]>>(
    mode === "manual" ? [query.key, queryState] : [query.key],
    () => query.fetcher(queryState),
    {
      ...query.config,
      revalidateIfStale:
        shouldRevalidate && (query.config?.revalidateIfStale ?? true),
      revalidateOnFocus:
        shouldRevalidate && (query.config?.revalidateOnFocus ?? true),
      revalidateOnReconnect:
        shouldRevalidate && (query.config?.revalidateOnReconnect ?? true),
    },
  );

  const resolvedColumns = useMemo(() => {
    if (typeof columns !== "function") return columns;
    return columns(result);
  }, [columns, result]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: resolvedColumns,
    data: result.data?.success ? result.data.data : [],

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

export type QueryDataControllerOptions<TData> = DataControllerOptions<TData> & {
  prefix?: string;
  suffix?: string;
};

const getSortingParser = (defaultValue: DataControllerState["sorting"]) =>
  createParser<DataControllerState["sorting"]>({
    parse: (v) => {
      if (!v) return [];
      return v
        .split(";")
        .map((part) => {
          const [id, rawDir] = part.split(":");
          const parsed = z.enum(["asc", "desc"]).safeParse(rawDir);
          if (!id || !parsed.success) return null;
          return { id, desc: parsed.data === "desc" };
        })
        .filter((v) => !!v);
    },
    serialize: (v) => {
      if (!v?.length) return null as unknown as string;
      return v.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(";");
    },
  }).withDefault(defaultValue);

const getRecordParser = (
  value: boolean,
  defaultValue: Record<string, boolean>,
) =>
  createParser<Record<string, boolean>>({
    parse: (v) => {
      if (!v) return defaultValue;
      return Object.fromEntries(v.split(",").map((v) => [v, value]));
    },
    serialize: (v) => {
      const entries = Object.entries(v);
      if (!entries?.length) return null as unknown as string;
      const serialized = entries
        .map(([k, v]) => (v === value ? k : null))
        .filter((v) => !!v)
        .join(",");
      return serialized || (null as unknown as string);
    },
  }).withDefault(defaultValue);

const columnFiltersSchema = z.object({
  id: z.string(),
  value: z.object({
    operator: z.enum(allFilterOperators),
    values: z.union([z.string(), z.number(), z.coerce.date()]).array(),
  }),
});

function getColumnFiltersParser<TData>(
  columns: ColumnDef<TData> | (() => ColumnDef<TData>),
) {
  return createParser<DataControllerState["columnFilters"]>({
    parse: (value) => {
      if (!value) return [];
      return value
        .split(";")
        .map((part) => {
          const [id, operator, rawValues = ""] = part.split(":");
          if (!id || !operator || !rawValues) return null;

          const resolvedColumns =
            typeof columns !== "function" ? columns : columns();
          const col = resolvedColumns.find((c) => c.id === id);
          if (!col) return null;

          const values = rawValues
            ? rawValues
                .split(",")
                .map((v) => {
                  if (col.meta?.type === "date") {
                    const d = parseLocalizedDate(v, "yyyyMMdd'T'HHmm");
                    if (isValid(d)) return d;
                    else return null;
                  }

                  if (col.meta?.type === "number") {
                    const n = Number(v);
                    if (!Number.isNaN(n)) return n;
                    else return null;
                  }

                  return v;
                })
                .filter((v) => !!v)
            : [];

          if (!values.length) return null;
          return { id, value: { operator, values } };
        })
        .filter((v) => !!v);
    },
    serialize: (value) => {
      if (!value?.length) return null as unknown as string;
      return value
        .map(({ id, value: rawValue }) => {
          const parsed = columnFiltersSchema.shape.value.safeParse(rawValue);
          if (!parsed.success) return null;

          const { operator, values } = parsed.data;
          const serializedValues = values.map((v) =>
            v instanceof Date
              ? formatLocalizedDate(v, "yyyyMMdd'T'HHmm")
              : String(v),
          );

          return `${id}:${operator}:${serializedValues.join(",")}`;
        })
        .filter((v) => !!v)
        .join(";");
    },
  }).withDefault([]);
}

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
    getColumnFiltersParser(props.columns),
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

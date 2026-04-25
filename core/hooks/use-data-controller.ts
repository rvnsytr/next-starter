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
import { useMemo, useState } from "react";
import useSWR, { mutate, SWRConfiguration, SWRResponse } from "swr";
import { DataControllerState } from "../data-controller";
import { ActionResponse } from "../types";
import { useDebounce } from "./use-debounce";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ColumnDef<TData> = ColumnDefType<TData, any>;
type AllDataControllerState = DataControllerState & {
  columnPinning: ColumnPinningState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
};

type DataControllerProps<TData> = Pick<
  TableOptions<TData>,
  "getRowId" | "enableRowSelection"
> & {
  mode?: "auto" | "manual";
  columns:
    | ColumnDef<TData>[]
    | ((result?: SWRResponse<ActionResponse<TData[]>>) => ColumnDef<TData>[]);
  query: {
    key: string;
    fetcher: (context: DataControllerState) => Promise<ActionResponse<TData[]>>;
    config?: SWRConfiguration;
  } & ({ immutable: true } | { immutable?: false; revalidate?: boolean });

  defaultState?: AllDataControllerState;
};

type StatelessDataControllerOptions<TData> = DataControllerProps<TData> & {
  state: {
    [K in keyof AllDataControllerState]: [
      AllDataControllerState[K],
      OnChangeFn<AllDataControllerState[K]>,
    ];
  };
};

type DataControllerResponse<TData> = {
  result: SWRResponse<ActionResponse<TData[]>>;
  table: Table<TData>;
};

export const pageSizes = [5, 10, 20, 30, 40, 50, 100];
export const defaultPageSize = pageSizes[1];

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

  return { result, table };
}

export function useDataController<TData>({
  defaultState,
  ...props
}: DataControllerProps<TData>) {
  const globalFilter = useState<string>(defaultState?.globalFilter ?? "");

  const pagination = useState<DataControllerState["pagination"]>({
    pageIndex: defaultState?.pagination.pageIndex ?? 0,
    pageSize: defaultState?.pagination.pageSize ?? defaultPageSize,
  });

  const sorting = useState<DataControllerState["sorting"]>(
    defaultState?.sorting ?? [],
  );

  const columnFilters = useState<DataControllerState["columnFilters"]>(
    defaultState?.columnFilters ?? [],
  );

  const columnPinning = useState<ColumnPinningState>({
    left: defaultState?.columnPinning.left ?? [],
    right: defaultState?.columnPinning.right ?? [],
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

export const mutateControlledData = (key: string) =>
  mutate((arg) => Array.isArray(arg) && arg[0] === key);

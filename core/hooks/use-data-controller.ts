"use client";

import {
  ColumnDef as ColumnDefType,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import useSWR, { mutate, SWRConfiguration, SWRResponse } from "swr";
import { DataControllerState } from "../data-controller";
import { ActionResponse } from "../types";
import { useDebounce } from "./use-debounce";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ColumnDef<TData> = ColumnDefType<TData, any>;

type DataControllerProps<TData> = {
  mode?: "auto" | "manual";
  columns:
    | ColumnDef<TData>[]
    | ((result?: SWRResponse<ActionResponse<TData[]>>) => ColumnDef<TData>[]);
  query: {
    key: string;
    fetcher: (context: DataControllerState) => Promise<ActionResponse<TData[]>>;
    config?: SWRConfiguration;
  } & ({ immutable: true } | { immutable?: false; revalidate?: boolean });

  defaultState?: DataControllerState;
};

type StatelessDataControllerOptions<TData> = DataControllerProps<TData> & {
  state: {
    [K in keyof DataControllerState]: [
      DataControllerState[K],
      OnChangeFn<DataControllerState[K]>,
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
    globalFilter: [globalFilterState, setSearchState],
    pagination: [paginationState, setPaginationState],
    sorting: [sortingState, setSortingState],
  },
}: StatelessDataControllerOptions<TData>): DataControllerResponse<TData> {
  const debouncedSearch = useDebounce(globalFilterState);

  const queryState: DataControllerState = useMemo(
    () => ({
      globalFilter: debouncedSearch,
      pagination: paginationState,
      sorting: sortingState,
    }),
    [debouncedSearch, paginationState, sortingState],
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
      globalFilter: globalFilterState,
      pagination: paginationState,
      sorting: sortingState,
      // columnFilters,
      // columnVisibility,
      // rowSelection,
      // columnPinning,
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: mode === "auto" ? getFilteredRowModel() : undefined,

    // ? Column Faceting
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // * Global Searching
    manualFiltering: mode === "manual",
    globalFilterFn: "includesString",
    onGlobalFilterChange: setSearchState,

    // * Pagination
    manualPagination: mode === "manual",
    rowCount: mode === "manual" ? (result.data?.count?.total ?? 0) : undefined,
    onPaginationChange: setPaginationState,
    getPaginationRowModel:
      mode === "auto" ? getPaginationRowModel() : undefined,

    // * Column Sorting
    manualSorting: mode === "manual",
    onSortingChange: setSortingState,
    getSortedRowModel: mode === "auto" ? getSortedRowModel() : undefined,

    // ? Column Pinning
    // onColumnPinningChange: setColumnPinning,
    // onColumnVisibilityChange: setColumnVisibility,

    // ? Row Selection
    // getRowId,
    // enableRowSelection,
    // onRowSelectionChange: setRowSelection,

    // * Column Filtering
    // onColumnFiltersChange: setColumnFilters,
    // getFilteredRowModel: !isManual ? getFilteredRowModel() : undefined,
  });

  return { result, table };
}

export function useDataController<TData>({
  defaultState,
  ...props
}: DataControllerProps<TData>) {
  const globalFilter = useState<string>(defaultState?.globalFilter ?? "");

  const pagination = useState<PaginationState>({
    pageIndex: defaultState?.pagination.pageIndex ?? 0,
    pageSize: defaultState?.pagination.pageSize ?? defaultPageSize,
  });

  const sorting = useState<SortingState>(defaultState?.sorting ?? []);

  return useStatelessDataController({
    ...props,
    state: { globalFilter, pagination, sorting },
  });
}

export const mutateControlledData = (key: string) =>
  mutate((arg) => Array.isArray(arg) && arg[0] === key);

"use client";

import {
  ColumnDef as ColumnDefType,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  OnChangeFn,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import useSWR, { mutate, SWRConfiguration, SWRResponse } from "swr";
import { useDebounce } from "./use-debounce";

export type DataControllerState = {
  search: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ColumnDef<TData> = ColumnDefType<TData, any>;

type DataControllerProps<TData> = {
  mode?: "auto" | "manual";
  columns: ColumnDef<TData>[] | ((result?: TData[]) => ColumnDef<TData>[]);
  query: {
    key: string;
    fetcher: (state: DataControllerState) => Promise<TData[]>;
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
  result: SWRResponse<TData[]>;
  table: Table<TData>;
  state: DataControllerState;
};

export function useStatelessDataController<TData>({
  mode,
  columns,
  query,

  state: {
    search: [searchState, setSearchState],
  },
}: StatelessDataControllerOptions<TData>): DataControllerResponse<TData> {
  const debouncedSearch = useDebounce(searchState);

  const state: DataControllerState = useMemo(
    () => ({
      search: debouncedSearch,
    }),
    [debouncedSearch],
  );

  const shouldRevalidate = !query.immutable && (query.revalidate ?? true);
  const result = useSWR<TData[]>(
    mode === "manual" ? [query.key, state] : [query.key],
    () => query.fetcher(state),
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
    return columns(result.data);
  }, [result.data, columns]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: resolvedColumns,
    data: result.data ?? [],

    state: {
      globalFilter: searchState,
      // sorting,
      // columnFilters,
      // pagination,
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

    // * Column Sorting
    // manualSorting: isManual,
    // onSortingChange: setSorting,
    // getSortedRowModel: !isManual ? getSortedRowModel() : undefined,

    // * Pagination
    // manualPagination: isManual,
    // rowCount: result.data?.success ? (result.data.count?.total ?? 0) : 0,
    // onPaginationChange: setPagination,
    // getPaginationRowModel: !isManual ? getPaginationRowModel() : undefined,
  });

  return { result, table, state };
}

export function useDataController<TData>({
  defaultState,
  ...props
}: DataControllerProps<TData>) {
  const search = useState<string>(defaultState?.search ?? "");

  return useStatelessDataController({
    ...props,
    state: {
      search,
    },
  });
}

export const mutateControlledData = (key: string) =>
  mutate((arg) => Array.isArray(arg) && arg[0] === key);

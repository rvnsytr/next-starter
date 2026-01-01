"use client";

import { messages } from "@/core/constants";
import { useDebounce, useIsMobile } from "@/core/hooks";
import { cn, formatNumber } from "@/core/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  Table as DataTableType,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  InitialTableState,
  PaginationState,
  Row,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  RotateCcw,
  SearchIcon,
} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import useSWR, { mutate, SWRConfiguration } from "swr";
import z from "zod";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { RefreshButton } from "./buttons.client";
import { Checkbox } from "./checkbox";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  ActiveFilters,
  ActiveFiltersMobileContainer,
  FilterActions,
  FilterSelector,
} from "./data-table-filter";
import { ErrorFallback } from "./fallback";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Kbd } from "./kbd";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const pageSizes = [1, 2, 3, 5, 10, 20, 30, 40, 50, 100];
export const defaultPageSize = pageSizes[1];

export const mutateDataTable = (key: string) =>
  mutate((a) => !!a && typeof a === "object" && "key" in a && a.key === key);

export type DataTableValue<T> = { total: number; data: T[] };

export type DataTableState = {
  pagination: PaginationState;
};

type CoreDataTableProps<T> = {
  mode: "client" | "server";
  swr: {
    key: string;
    fetcher: (state: DataTableState) => Promise<DataTableValue<T>>;
    config?: SWRConfiguration;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
};

type ToolBoxProps<T> = {
  searchPlaceholder?: string;
  withRefresh?: boolean;

  renderRowSelection?: (props: {
    rows: Row<T>[];
    table: DataTableType<T>;
  }) => ReactNode;
};

export type DataTableProps<T> = ToolBoxProps<T> & {
  initialState?: InitialTableState;

  caption?: string;
  placeholder?: string;
  className?: string;
  classNames?: {
    toolbox?: string;
    filterContainer?: string;
    tableContainer?: string;
    table?: string;
    footer?: string;
  };
};

export function DataTable<T>({
  mode,
  swr,
  columns,

  caption,
  placeholder,
  className,
  classNames,

  initialState,

  getRowId,
  enableRowSelection,

  ...props
}: CoreDataTableProps<T> &
  DataTableProps<T> &
  Pick<TableOptions<T>, "getRowId" | "enableRowSelection">) {
  const isServer = mode === "server";
  const isMobile = useIsMobile();

  const arrayQueryState = parseAsArrayOf(parseAsString, ";").withDefault([]);
  const recordQueryState = parseAsJson(
    z.record(z.string(), z.boolean()),
  ).withDefault({});

  const [columnVisibility, setColumnVisibility] = useQueryState(
    "col-v",
    recordQueryState,
  );

  const [columnPinning, setColumnPinning] = useQueryStates(
    { left: arrayQueryState, right: arrayQueryState },
    { urlKeys: { left: "col-pl", right: "col-pr" } },
  );

  const [rowSelection, setRowSelection] = useQueryState(
    "row-s",
    recordQueryState,
  );

  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: parseAsInteger.withDefault(0),
      pageSize: parseAsInteger.withDefault(defaultPageSize),
    },
    { urlKeys: { pageIndex: "pg-i", pageSize: "pg-s" } },
  );

  const [sorting, setSorting] = useQueryState(
    "col-s",
    parseAsArrayOf(
      parseAsJson(z.object({ id: z.string(), desc: z.boolean() })),
      ";",
    ).withDefault([]),
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [globalFilter, setGlobalFilter] = useQueryState(
    "fil-glo",
    parseAsString.withDefault(""),
  );

  const debouncedGlobalFilter = useDebounce(globalFilter);

  const allState = useMemo(
    () => ({
      pagination,
      sorting,
      // columnFilters,
      globalFilter: debouncedGlobalFilter,
    }),
    [pagination, sorting, debouncedGlobalFilter],
  );

  const baseArgument = { key: swr.key };
  const { data, isLoading, error } = useSWR(
    isServer ? { ...baseArgument, ...allState } : baseArgument,
    async () => await swr.fetcher(allState),
    swr.config,
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: data?.data ?? [],

    initialState: initialState,
    state: {
      pagination,

      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnPinning,
    },

    getCoreRowModel: getCoreRowModel(),

    // ? Column Faceting
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // ? Column Pinning
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,

    // ? Row Selection
    getRowId,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,

    // * Pagination
    manualPagination: isServer,
    rowCount: data?.total ?? 0,
    onPaginationChange: setPagination,
    getPaginationRowModel: !isServer ? getPaginationRowModel() : undefined,

    // * Sorting
    manualSorting: isServer,
    onSortingChange: setSorting,
    getSortedRowModel: !isServer ? getSortedRowModel() : undefined,

    // TODO: Column Filtering
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    // * Global Searching
    manualFiltering: isServer,
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
  });

  if (error) return <ErrorFallback error={error} />;

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <ToolBox
        table={table}
        isMobile={isMobile}
        className={classNames?.toolbox}
        {...props}
      />

      {table.getState().columnFilters.length > 0 && (
        <ActiveFiltersMobileContainer className={classNames?.filterContainer}>
          <FilterActions table={table} />
          <Separator orientation="vertical" className="h-4" />
          <ActiveFilters table={table} />
        </ActiveFiltersMobileContainer>
      )}

      <Table
        className={classNames?.table}
        containerClassName={cn("rounded-lg border", classNames?.tableContainer)}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(
                ({ id, column, isPlaceholder, getContext }) => {
                  const columnPinned = column.getIsPinned();
                  return (
                    <TableHead
                      key={id}
                      className={cn(
                        "z-10 text-center",
                        columnPinned && "bg-background/90 sticky z-20",
                        columnPinned === "left" && "left-0",
                        columnPinned === "right" && "right-0",
                      )}
                      // style={{
                      //   left: column.getStart("left"),
                      //   right: column.getAfter("right"),
                      // }}
                    >
                      {isPlaceholder
                        ? null
                        : flexRender(column.columnDef.header, getContext())}
                    </TableHead>
                  );
                },
              )}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: pagination.pageSize }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={columns.length}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map(({ id, column, getContext }) => {
                  const columnPinned = column.getIsPinned();
                  return (
                    <TableCell
                      key={id}
                      className={cn(
                        "z-10",
                        columnPinned && "bg-background/90 sticky z-20",
                        columnPinned === "left" && "left-0",
                        columnPinned === "right" && "right-0",
                      )}
                      // style={{
                      //   left: column.getStart("left"),
                      //   right: column.getAfter("right"),
                      // }}
                    >
                      {flexRender(column.columnDef.cell, getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground py-4 text-center whitespace-pre-line"
              >
                {placeholder ?? messages.empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div
        className={cn(
          "flex w-full flex-col items-center gap-4 text-center lg:flex-row",
          classNames?.footer,
        )}
      >
        <RowsPerPage
          table={table}
          isMobile={isMobile}
          className="order-4 shrink-0 lg:order-1"
        />

        <small className="text-muted-foreground order-3 shrink-0 lg:order-2">
          {formatNumber(table.getFilteredSelectedRowModel().rows.length)} dari{" "}
          {isLoading
            ? "?"
            : formatNumber(table.getFilteredRowModel().rows.length)}{" "}
          baris dipilih
        </small>

        <small className="text-muted-foreground order-1 mx-auto text-sm lg:order-3">
          {caption}
        </small>

        <small className="order-2 shrink-0 tabular-nums lg:order-4">
          Halaman {isLoading ? "?" : formatNumber(pagination.pageIndex + 1)}{" "}
          dari {isLoading ? "?" : formatNumber(table.getPageCount())}
        </small>

        <Pagination
          table={table}
          isMobile={isMobile}
          className="order-3 shrink-0 lg:order-5"
        />
      </div>
    </div>
  );
}

function ToolBox<T>({
  table,
  isMobile,
  className,
  searchPlaceholder = "Cari...",
  withRefresh = false,
  renderRowSelection,
}: ToolBoxProps<T> & {
  table: DataTableType<T>;
  isMobile: boolean;
  className?: string;
}) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 lg:flex-row lg:justify-between",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-2 lg:flex-row lg:items-center")}>
        <ButtonGroup className="w-full lg:w-fit [&_button]:grow">
          <FilterSelector table={table} />
          <View table={table} isMobile={isMobile} withRefresh={withRefresh} />
          {withRefresh && <RefreshButton variant="outline" />}
        </ButtonGroup>

        {!isMobile && <Separator orientation="vertical" className="h-5" />}

        {selectedRows.length > 0 &&
          renderRowSelection?.({ table, rows: selectedRows })}
      </div>

      <div className="flex gap-x-2 *:grow">
        <Reset table={table} />
        <Search
          table={table}
          placeholder={searchPlaceholder}
          className="col-span-2"
        />
      </div>
    </div>
  );
}

function View<T>({
  table,
  isMobile,
  withRefresh,
}: {
  table: DataTableType<T>;
  isMobile: boolean;
  withRefresh: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Columns3 /> Lihat
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={isMobile && !withRefresh ? "end" : "center"}
        className="flex flex-col gap-y-1 p-0"
      >
        <Command>
          <CommandInput placeholder="Cari Kolom..." />
          <CommandList className="p-1">
            <CommandEmpty>{messages.empty}</CommandEmpty>

            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const cbId = `cb-${column.id}`;
                const isVisible = column.getIsVisible();
                const Icon = column.columnDef.meta?.icon;
                return (
                  <CommandItem key={cbId} className="justify-between" asChild>
                    <Label htmlFor={cbId}>
                      <div className="flex items-center gap-x-2">
                        {Icon && (
                          <Icon className="text-muted-foreground group-hover:text-primary transition-colors" />
                        )}

                        <small className="font-medium">
                          {column.columnDef.meta?.displayName ?? column.id}
                        </small>
                      </div>

                      <Checkbox
                        id={cbId}
                        checked={isVisible}
                        onCheckedChange={(v) => column.toggleVisibility(!!v)}
                      />
                    </Label>
                  </CommandItem>
                );
              })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function Reset<T>({
  table,
  className,
}: {
  table: DataTableType<T>;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      className={className}
      onClick={() => {
        table.reset();
        table.resetColumnFilters();
        table.resetColumnOrder();
        table.resetColumnPinning();
        table.resetColumnSizing();
        table.resetColumnVisibility();
        table.resetExpanded();

        table.resetGlobalFilter();
        table.setGlobalFilter("");

        table.resetGrouping();
        table.resetHeaderSizeInfo();
        table.resetPageIndex();
        table.resetPageSize();
        table.resetPagination();
        table.resetRowPinning();
        table.resetRowSelection();
        table.resetSorting();
      }}
    >
      <RotateCcw /> {messages.actions.reset}
    </Button>
  );
}

function Search<T>({
  table,
  placeholder = "Cari...",
  className,
}: {
  table: DataTableType<T>;
  placeholder?: string;
  className?: string;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <InputGroup className={className}>
      <InputGroupInput
        ref={searchRef}
        placeholder={placeholder}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
      />

      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        {/* <Kbd>⌘</Kbd> */}
        <Kbd>/</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}

function Pagination<T>({
  table,
  isMobile,
  className,
}: {
  table: DataTableType<T>;
  isMobile: boolean;
  className?: string;
}) {
  const size = isMobile ? "icon" : "icon-sm";
  const variant = "outline";
  return (
    <ButtonGroup className={cn(className)}>
      <Button
        size={size}
        variant={variant}
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight />
      </Button>
    </ButtonGroup>
  );
}

function RowsPerPage<T>({
  table,
  isMobile,
  className,
}: {
  table: DataTableType<T>;
  isMobile: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      <Label>Baris per halaman</Label>
      <Select
        value={String(table.getState().pagination.pageSize ?? defaultPageSize)}
        onValueChange={(value) => table.setPageSize(Number(value))}
      >
        <SelectTrigger size={isMobile ? "default" : "sm"}>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {pageSizes.map((item) => (
            <SelectItem key={item} value={String(item)}>
              {formatNumber(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

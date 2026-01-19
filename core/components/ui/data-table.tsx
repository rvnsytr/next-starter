"use client";

import { ActionResponse, messages } from "@/core/constants";
import {
  allDateFilterOperators,
  allMultiOptionFilterOperators,
  allNumberFilterOperators,
  allOptionFilterOperators,
  allTextFilterOperators,
} from "@/core/filter";
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
  PaginationState,
  Row,
  SortingState,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { isValid } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  RotateCcwSquareIcon,
  SearchIcon,
  ViewIcon,
} from "lucide-react";
import {
  createParser,
  parseAsArrayOf,
  parseAsIndex,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { ReactNode, useEffect, useMemo, useRef } from "react";
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

export type DataTableState = {
  globalFilter: string;
  columnFilters: z.infer<typeof columnFiltersSchema>[];
  sorting: SortingState;
  pagination: PaginationState;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataTableColumnDef<TData> = ColumnDef<TData, any>[];

type CoreDataTableProps<TData> = {
  mode: "client" | "server";
  swr: {
    key: string;
    fetcher: (state: DataTableState) => Promise<ActionResponse<TData[]>>;
    config?: SWRConfiguration;
  };
  getColumns: (
    res?: Extract<ActionResponse<TData[]>, { success: true }>,
  ) => DataTableColumnDef<TData>;
};

type ToolBoxProps<TData> = {
  searchPlaceholder?: string;
  withRefresh?: boolean;

  renderRowSelection?: (props: {
    rows: Row<TData>[];
    table: DataTableType<TData>;
  }) => ReactNode;
};

export type DataTableProps<TData> = ToolBoxProps<TData> & {
  id?: string;
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

const pageSizes = [5, 10, 20, 30, 40, 50, 100];
const defaultPageSize = pageSizes[1];

const columnFiltersSchema = z.object({
  id: z.string(),
  value: z.union([
    z.object({
      operator: z.enum([
        ...allTextFilterOperators,
        ...allOptionFilterOperators,
        ...allMultiOptionFilterOperators,
      ]),
      values: z.string().array(),
    }),
    z.object({
      operator: z.enum(allNumberFilterOperators),
      values: z.number().array(),
    }),
    z.object({
      operator: z.enum(allDateFilterOperators),
      values: z.date().array(),
    }),
  ]),
});

const arrayQSParser = parseAsArrayOf(parseAsString).withDefault([]);

const getRecordQSParser = (parseValue: boolean) =>
  createParser<Record<string, boolean>>({
    parse: (value) => {
      if (!value) return {};
      return Object.fromEntries(value.split(",").map((v) => [v, parseValue]));
    },
    serialize: (value) => {
      const entries = Object.entries(value);
      // Nuqs TS bug? it should returned `string | null`
      if (!entries?.length) return null as unknown as string;
      return entries
        .map(([k, v]) => (v === parseValue ? k : null))
        .filter((v) => !!v)
        .join(",");
    },
  }).withDefault({});

const sortingParser = createParser<SortingState>({
  parse: (value) => {
    if (!value) return [];
    return value
      .split(";")
      .map((part) => {
        const [id, rawDir] = part.split(":");
        const parsed = z.enum(["asc", "desc"]).safeParse(rawDir);
        if (!id || !parsed.success) return null;
        return { id, desc: parsed.data === "desc" };
      })
      .filter((v) => !!v);
  },
  serialize: (value) => {
    // Nuqs TS bug? it should returned `string | null`
    if (!value?.length) return null as unknown as string;
    return value.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(";");
  },
}).withDefault([]);

export function columnFiltersParser<TData>(
  getColumns: () => DataTableColumnDef<TData>,
) {
  return createParser<ColumnFiltersState>({
    parse: (value) => {
      if (!value) return [];
      return value
        .split(";")
        .map((part) => {
          const [id, operator, rawValues = ""] = part.split(":");
          if (!id || !operator || !rawValues) return null;

          const col = getColumns().find((c) => c.id === id);
          if (!col) return null;

          const values = rawValues
            ? rawValues
                .split(",")
                .map((v) => {
                  if (col.meta?.type === "date") {
                    const d = new Date(Number(v));
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
      // Nuqs TS bug? it should returned `string | null`
      if (!value?.length) return null as unknown as string;

      return value
        .map(({ id, value: rawValue }) => {
          const parsed = columnFiltersSchema.shape.value.safeParse(rawValue);
          if (!parsed.success) return null;

          const { operator, values } = parsed.data;
          const serializedValues = values.map((v) =>
            v instanceof Date ? v.getTime() : String(v),
          );

          return `${id}:${operator}:${serializedValues.join(",")}`;
        })
        .filter((v) => !!v)
        .join(";");
    },
  }).withDefault([]);
}

export const mutateDataTable = (key: string) =>
  mutate((a) => !!a && typeof a === "object" && "key" in a && a.key === key);

export function DataTable<TData>({
  mode,
  swr,
  getColumns,

  id,
  caption,
  placeholder,
  className,
  classNames,

  getRowId,
  enableRowSelection,

  ...props
}: CoreDataTableProps<TData> &
  DataTableProps<TData> &
  Pick<TableOptions<TData>, "getRowId" | "enableRowSelection">) {
  const isServer = mode === "server";
  const prefix = id ? `${id}-` : "";

  const [columnVisibility, setColumnVisibility] = useQueryState(
    `${prefix}col-vis`,
    getRecordQSParser(false),
  );

  const [columnPinning, setColumnPinning] = useQueryStates(
    { left: arrayQSParser, right: arrayQSParser },
    { urlKeys: { left: `${prefix}pin-l`, right: `${prefix}pin-r` } },
  );

  const [rowSelection, setRowSelection] = useQueryState(
    `${prefix}row-selected`,
    getRecordQSParser(true),
  );

  const [globalFilter, setGlobalFilter] = useQueryState(
    `${prefix}global-filter`,
    parseAsString.withDefault(""),
  );

  const [columnFilters, setColumnFilters] = useQueryState(
    `${prefix}filter`,
    columnFiltersParser(getColumns),
  );

  const [sorting, setSorting] = useQueryState(`${prefix}sort`, sortingParser);

  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: parseAsIndex.withDefault(0),
      pageSize: parseAsInteger.withDefault(defaultPageSize),
    },
    { urlKeys: { pageIndex: `${prefix}page`, pageSize: `${prefix}size` } },
  );

  const debouncedGlobalFilter = useDebounce(globalFilter);

  const allStates: DataTableState = useMemo(() => {
    const parsed = columnFiltersSchema.array().safeParse(columnFilters);
    return {
      globalFilter: debouncedGlobalFilter,
      columnFilters: parsed.data ?? [],
      sorting,
      pagination,
    };
  }, [debouncedGlobalFilter, columnFilters, sorting, pagination]);

  const baseArgument = { key: swr.key };
  const { data, isLoading, error } = useSWR(
    isServer ? { ...baseArgument, ...allStates } : baseArgument,
    async () => await swr.fetcher(allStates),
    swr.config,
  );

  const columns = useMemo(() => {
    if (data?.success) return getColumns(data);
    return getColumns();
  }, [data, getColumns]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: data?.success ? data.data : [],

    state: {
      globalFilter,
      sorting,
      columnFilters,
      pagination,
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

    // * Global Searching
    manualFiltering: isServer,
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,

    // * Column Filtering
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: !isServer ? getFilteredRowModel() : undefined,

    // * Column Sorting
    manualSorting: isServer,
    onSortingChange: setSorting,
    getSortedRowModel: !isServer ? getSortedRowModel() : undefined,

    // * Pagination
    manualPagination: isServer,
    rowCount: data?.count?.total ?? 0,
    onPaginationChange: setPagination,
    getPaginationRowModel: !isServer ? getPaginationRowModel() : undefined,
  });

  if (error) return <ErrorFallback error={error} />;
  if (!isLoading && !data?.success)
    return <ErrorFallback error={data?.error} />;

  const pageCount = table.getPageCount();
  const selectedRowsCount =
    Object.keys(rowSelection).length ??
    table.getFilteredSelectedRowModel().rows.length;
  const rowsCount =
    data?.count?.total ?? table.getFilteredRowModel().rows.length;

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <ToolBox table={table} className={classNames?.toolbox} {...props} />

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
                      {!isPlaceholder &&
                        flexRender(column.columnDef.header, getContext())}
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
        <RowsPerPage table={table} className="order-4 shrink-0 lg:order-1" />

        <small className="text-muted-foreground order-3 shrink-0 lg:order-2">
          {formatNumber(selectedRowsCount)} dari{" "}
          {isLoading ? "?" : formatNumber(rowsCount)} baris dipilih
        </small>

        <small className="text-muted-foreground order-1 mx-auto text-sm lg:order-3">
          {caption}
        </small>

        <small className="order-2 shrink-0 tabular-nums lg:order-4">
          Halaman {isLoading ? "?" : formatNumber(pagination.pageIndex + 1)}{" "}
          dari {isLoading ? "?" : formatNumber(pageCount > 0 ? pageCount : 1)}
        </small>

        <Pagination table={table} className="order-3 shrink-0 lg:order-5" />
      </div>
    </div>
  );
}

function ToolBox<TData>({
  table,
  className,
  searchPlaceholder = "Cari...",
  withRefresh = false,
  renderRowSelection,
}: ToolBoxProps<TData> & {
  table: DataTableType<TData>;
  className?: string;
}) {
  const isMobile = useIsMobile();

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const isSelected = selectedRows.length > 0;

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
          <View table={table} withRefresh={withRefresh} />
          {withRefresh && <RefreshButton variant="outline" />}
        </ButtonGroup>

        {isSelected && !isMobile && (
          <Separator orientation="vertical" className="h-4" />
        )}

        {isSelected && renderRowSelection?.({ table, rows: selectedRows })}
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

function View<TData>({
  table,
  withRefresh,
}: {
  table: DataTableType<TData>;
  withRefresh: boolean;
}) {
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ViewIcon /> Lihat
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

function Reset<TData>({
  table,
  className,
}: {
  table: DataTableType<TData>;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      className={className}
      onClick={() => {
        table.reset();

        table.resetPagination();
        // table.resetPageIndex();
        // table.resetPageSize();

        table.resetColumnOrder();
        table.resetColumnSizing();
        table.resetColumnVisibility();
        table.resetColumnPinning();
        table.resetColumnFilters();

        table.resetRowPinning();
        table.resetRowSelection();

        // table.resetGlobalFilter();
        table.setGlobalFilter("");

        table.resetSorting();
        table.resetGrouping();
        table.resetExpanded();
        table.resetHeaderSizeInfo();
      }}
    >
      <RotateCcwSquareIcon /> {messages.actions.reset}
    </Button>
  );
}

function Search<TData>({
  table,
  placeholder = "Cari...",
  className,
}: {
  table: DataTableType<TData>;
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

function Pagination<TData>({
  table,
  className,
}: {
  table: DataTableType<TData>;
  className?: string;
}) {
  const isMobile = useIsMobile();

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
        <ChevronsLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRightIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRightIcon />
      </Button>
    </ButtonGroup>
  );
}

function RowsPerPage<TData>({
  table,
  className,
}: {
  table: DataTableType<TData>;
  className?: string;
}) {
  const isMobile = useIsMobile();

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
          {pageSizes.map((v) => (
            <SelectItem
              key={v}
              value={String(v)}
              className={cn(v === defaultPageSize && "font-semibold")}
            >
              {formatNumber(v)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

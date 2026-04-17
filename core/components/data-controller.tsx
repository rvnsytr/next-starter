// * Headless state controller for managing tabular data.
"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import {
  ColumnDef as ColumnDefType,
  ColumnFiltersState,
  ColumnPinningState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  Table as TableType,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { isValid } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
  ViewIcon,
} from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR, { mutate, SWRConfiguration, SWRResponse } from "swr";
import z from "zod";
import { allFilterOperators } from "../data-filter";
import { ApiResponse } from "../fetcher";
import { useDebounce } from "../hooks/use-debounce";
import { messages } from "../messages";
import { cn, formatNumber } from "../utils";
import { Button, ButtonProps } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Checkbox } from "./ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { ErrorFallback } from "./ui/fallback";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Kbd } from "./ui/kbd";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const columnFiltersSchema = z.object({
  id: z.string(),
  value: z.object({
    operator: z.enum(allFilterOperators),
    values: z.union([z.string(), z.number(), z.coerce.date()]).array(),
  }),
});

export const dataQueryStateSchema = z.object({
  hidden: z.string().optional().catch(""),

  left: z.string().optional().catch(""),
  right: z.string().optional().catch(""),

  selected: z.string().optional().catch(""),

  search: z.string().optional().catch(""),
  columnFilters: z.string().optional().catch(""),
  sorting: z.string().optional().catch(""),

  page: z.coerce.number().min(1).optional().catch(0),
  size: z.coerce.number().min(1).optional().catch(10),
});

export type DataQueryState = z.infer<typeof dataQueryStateSchema>;

export type DataQueryStateProps = {
  defaultState?: DataQueryState;
  onStateChange?: (state: DataQueryState) => void;
};

export type DataState = {
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  pagination: PaginationState;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ColumnDef<TData> = ColumnDefType<TData, any>[];

export type DataControllerProps<TData> = DataQueryStateProps &
  Pick<TableOptions<TData>, "getRowId" | "enableRowSelection"> & {
    mode?: "auto" | "manual";
    query: {
      key: string;
      fetcher: (state: DataState) => Promise<ApiResponse<TData[]>>;
      config?: SWRConfiguration;
    };

    columns:
      | ColumnDef<TData>
      | ((result?: SWRResponse<ApiResponse<TData[]>>) => ColumnDef<TData>);

    render: (context: {
      result: SWRResponse<ApiResponse<TData[]>>;
      table: TableType<TData>;
      columns: ColumnDef<TData>;
    }) => React.ReactNode;
  };

// #region Query State Parser

const arrayParser = {
  parse: (value?: string) => {
    if (!value) return [];
    return decodeURIComponent(value).split(",");
  },
  serialize: (value?: string[]) => {
    if (!value?.length) return undefined;
    return encodeURIComponent(value.join(","));
  },
};

const getRecordParser = (parseValue: boolean) => ({
  parse: (value?: string) => {
    if (!value) return {};
    const entries = decodeURIComponent(value)
      .split(",")
      .map((v) => [v, parseValue]);
    return Object.fromEntries(entries);
  },
  serialize: (value: Record<string, boolean>) => {
    const entries = Object.entries(value);
    if (!entries.length) return undefined;
    const str = entries
      .map(([k, v]) => (v === parseValue ? k : null))
      .filter((v) => !!v)
      .join(",");
    if (!str) return undefined;
    return encodeURIComponent(str);
  },
});

const sortingParser = {
  parse: (value?: string) => {
    if (!value) return [];
    return decodeURIComponent(value)
      .split(";")
      .map((part) => {
        const [id, rawDir] = part.split(":");
        const parsed = z.enum(["asc", "desc"]).safeParse(rawDir);
        if (!id || !parsed.success) return null;
        return { id, desc: parsed.data === "desc" };
      })
      .filter((v) => !!v);
  },
  serialize: (value: SortingState) => {
    if (!value.length) return undefined;
    const str = value
      .map((v) => `${v.id}:${v.desc ? "desc" : "asc"}`)
      .join(";");
    return encodeURIComponent(str);
  },
};

function columnFiltersParser<TData>() {
  return {
    parse: (
      columns: ColumnDef<TData> | (() => ColumnDef<TData>),
      value?: string,
    ) => {
      if (!value) return [];
      return decodeURIComponent(value)
        .split(";")
        .map((part) => {
          const [id, operator, rawValues = ""] = part.split(":");
          if (!id || !operator || !rawValues) return null;

          const resolvedColumns =
            typeof columns === "function" ? columns() : columns;
          const column = resolvedColumns.find((c) => c.id === id);
          if (!column) return null;

          const values = rawValues
            ? rawValues
                .split(",")
                .map((v) => {
                  if (column.meta?.type === "date") {
                    const d = new Date(Number(v));
                    if (isValid(d)) return d;
                    else return null;
                  }

                  if (column.meta?.type === "number") {
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
    serialize: (value: ColumnFiltersState) => {
      if (!value?.length) return undefined;

      const str = value
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

      return encodeURIComponent(str);
    },
  };
}

// #endregion

type DataControllerContextType = {
  state: DataState;
  defaultState?: DataQueryState;
};

const DataControllerContext = createContext<
  DataControllerContextType | undefined
>(undefined);

export const pageSizes = [5, 10, 20, 30, 40, 50, 100];
export const defaultPageSize = pageSizes[1];

export const mutateData = (key: string) =>
  mutate((a) => !!a && typeof a === "object" && "key" in a && a.key === key);

export function DataController<TData>({
  mode = "auto",
  query,
  columns,

  defaultState,
  onStateChange,

  render,

  getRowId,
  enableRowSelection,
}: DataControllerProps<TData>) {
  const isManual = mode === "manual";

  // #region Query State

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getRecordParser(false).parse(defaultState?.hidden),
  );

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: arrayParser.parse(defaultState?.left),
    right: arrayParser.parse(defaultState?.right),
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    getRecordParser(true).parse(defaultState?.selected),
  );

  const [globalFilter, setGlobalFilter] = useState<string>(
    defaultState?.search ?? "",
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    columnFiltersParser<TData>().parse(columns, defaultState?.columnFilters),
  );

  const [sorting, setSorting] = useState<SortingState>(
    sortingParser.parse(defaultState?.sorting),
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: defaultState?.page ? defaultState.page - 1 : 0,
    pageSize: defaultState?.size ?? defaultPageSize,
  });

  const debouncedGlobalFilter = useDebounce(globalFilter);

  const dataState: DataState = useMemo(
    () => ({
      globalFilter: debouncedGlobalFilter,
      columnFilters,
      sorting,
      pagination,
    }),
    [debouncedGlobalFilter, columnFilters, sorting, pagination],
  );

  useEffect(() => {
    onStateChange?.({
      hidden: getRecordParser(false).serialize(columnVisibility),

      left: arrayParser.serialize(columnPinning.left),
      right: arrayParser.serialize(columnPinning.right),

      selected: getRecordParser(true).serialize(rowSelection),

      search: !!debouncedGlobalFilter ? debouncedGlobalFilter : undefined,
      columnFilters: columnFiltersParser().serialize(columnFilters),
      sorting: sortingParser.serialize(sorting),

      page: pagination.pageIndex > 0 ? pagination.pageIndex + 1 : undefined,
      size:
        pagination.pageSize !== defaultPageSize
          ? pagination.pageSize
          : undefined,
    } satisfies DataQueryState);
  }, [
    onStateChange,
    columnVisibility,
    columnPinning,
    rowSelection,
    debouncedGlobalFilter,
    columnFilters,
    sorting,
    pagination,
  ]);

  // #endregion

  const result = useSWR(
    isManual ? { key: query.key, ...dataState } : { key: query.key },
    async () => await query.fetcher(dataState),
    query.config,
  );

  const resolvedColumns = useMemo(
    () => (typeof columns === "function" ? columns(result) : columns),
    [result, columns],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: resolvedColumns,
    data: result.data?.success ? result.data.data : [],

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
    manualFiltering: isManual,
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,

    // * Column Filtering
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: !isManual ? getFilteredRowModel() : undefined,

    // * Column Sorting
    manualSorting: isManual,
    onSortingChange: setSorting,
    getSortedRowModel: !isManual ? getSortedRowModel() : undefined,

    // * Pagination
    manualPagination: isManual,
    rowCount: result.data?.success ? (result.data.count?.total ?? 0) : 0,
    onPaginationChange: setPagination,
    getPaginationRowModel: !isManual ? getPaginationRowModel() : undefined,
  });

  if (result.error) return <ErrorFallback error={result.error} />;
  if (!result.isLoading && !result.data?.success)
    return <ErrorFallback error={result.data?.error} />;

  return (
    <DataControllerContext.Provider value={{ state: dataState, defaultState }}>
      {render({ result, table, columns: resolvedColumns })}
    </DataControllerContext.Provider>
  );
}

export function useDataController() {
  const ctx = useContext(DataControllerContext);
  if (!ctx) {
    const message =
      "useDataControllerState must be used in DataControllerProvider";
    throw new Error(message);
  }
  return ctx;
}

export function DataControllerVisibility<TData>({
  table,
  align,
  placeholder,
  size = "default",
  variant = "outline",
  className,
  ...props
}: ButtonProps & {
  table: TableType<TData>;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
  placeholder?: { search?: string; empty?: string };
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={size} variant={variant} {...props}>
          <ViewIcon /> {!size?.startsWith("icon") && "Lihat"}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        className={cn("flex flex-col gap-y-1 p-0", className)}
      >
        <Command>
          <CommandInput placeholder={placeholder?.search ?? "Cari Kolom..."} />
          <CommandList className="p-1">
            <CommandEmpty>{placeholder?.empty ?? messages.empty}</CommandEmpty>

            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const cbId = `data-controller-visibility-cb-${column.id}`;
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
                          {column.columnDef.meta?.label ?? column.id}
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

export function DataControllerSearch<TData>({
  table,
  placeholder = "Cari...",
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "ref" | "value" | "onChange"
> & { table: TableType<TData> }) {
  const searchRef = useRef<HTMLInputElement>(null);

  useHotkey("/", () => searchRef.current?.focus());

  return (
    <InputGroup className={className}>
      <InputGroupInput
        ref={searchRef}
        placeholder={placeholder}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        {...props}
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

export function DataControllerPaginationNav<TData>({
  table,
  size = "icon",
  variant = "outline",
  className,
  disabled = false,
  ...props
}: Omit<ButtonProps, "onClick"> & {
  table: TableType<TData>;
}) {
  return (
    <ButtonGroup className={cn(className)}>
      <Button
        size={size}
        variant={variant}
        onClick={() => table.firstPage()}
        disabled={disabled || !table.getCanPreviousPage()}
        {...props}
      >
        <ChevronsLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.previousPage()}
        disabled={disabled || !table.getCanPreviousPage()}
        {...props}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.nextPage()}
        disabled={disabled || !table.getCanNextPage()}
        {...props}
      >
        <ChevronRightIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.lastPage()}
        disabled={disabled || !table.getCanNextPage()}
        {...props}
      >
        <ChevronsRightIcon />
      </Button>
    </ButtonGroup>
  );
}

export function DataControllerPageSize<TData>({
  table,
  initialSizeState,
  size = "sm",
  ...props
}: React.ComponentProps<typeof SelectTrigger> & {
  table: TableType<TData>;
  initialSizeState?: number;
}) {
  const value =
    table.getState().pagination.pageSize ?? initialSizeState ?? defaultPageSize;

  return (
    <Select
      value={String(value)}
      onValueChange={(value) => table.setPageSize(Number(value))}
    >
      <SelectTrigger size={size} {...props}>
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
  );
}

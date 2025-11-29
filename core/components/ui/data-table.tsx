"use client";

import { messages } from "@/core/constants";
import { useIsMobile } from "@/core/hooks";
import { cn, formatNumber } from "@/core/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  Table as DataTableType,
  InitialTableState,
  Row,
  SortingState,
  TableOptions,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { ReactNode, useEffect, useRef, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

type DataTableProps<TData> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
};

export type TableProps<TData> = { table: DataTableType<TData> };
export type ToolBoxProps = {
  searchPlaceholder?: string;
  withRefresh?: boolean;
};

export type OtherDataTableProps<TData> = ToolBoxProps & {
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

  initialState?: InitialTableState;
  rowSelectionFn?: (
    data: Row<TData>[],
    table: DataTableType<TData>,
  ) => ReactNode;
};

const rowsLimitArr = [5, 10, 20, 30, 40, 50, 100];
const defaultRowsLimit = rowsLimitArr[2];

export function DataTable<TData>({
  data,
  columns,
  caption,
  placeholder,
  className,
  classNames,
  initialState,
  rowSelectionFn,
  enableRowSelection,
  ...props
}: DataTableProps<TData> &
  OtherDataTableProps<TData> &
  Pick<TableOptions<TData>, "enableRowSelection">) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });

  const isMobile = useIsMobile();
  const [rowSelector, setRowSelector] = useState<ReactNode>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    enableRowSelection,
    onRowSelectionChange: setRowSelection,

    onColumnPinningChange: setColumnPinning,

    initialState: {
      pagination: { pageIndex: 0, pageSize: defaultRowsLimit },
      ...initialState,
    },

    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnPinning,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const filteredRows = table.getFilteredRowModel().rows;

  const totalPage = table.getPageCount() > 0 ? table.getPageCount() : 1;
  const pageNumber =
    table.getPageCount() > 0 ? table.getState().pagination.pageIndex + 1 : 1;

  useEffect(() => {
    if (rowSelectionFn) setRowSelector(rowSelectionFn(selectedRows, table));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelectionFn, selectedRows]);

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <ToolBox
        table={table}
        isMobile={isMobile}
        className={classNames?.toolbox}
        {...props}
      >
        {selectedRows.length > 0 && rowSelector}
      </ToolBox>

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
          {table.getRowModel().rows?.length ? (
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
          rowsLimitArr={rowsLimitArr}
          className="order-4 shrink-0 lg:order-1"
        />

        <small className="text-muted-foreground order-3 shrink-0 lg:order-2">
          {formatNumber(selectedRows.length)} dari{" "}
          {formatNumber(filteredRows.length)} baris dipilih
        </small>

        <small className="text-muted-foreground order-1 mx-auto text-sm lg:order-3">
          {caption}
        </small>

        <small className="order-2 shrink-0 tabular-nums lg:order-4">
          Halaman {formatNumber(pageNumber)} dari {formatNumber(totalPage)}
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

function ToolBox<TData>({
  table,
  searchPlaceholder,
  withRefresh = false,
  isMobile = false,
  className,
  children,
}: TableProps<TData> &
  ToolBoxProps & {
    isMobile?: boolean;
    className?: string;
    children: ReactNode;
  }) {
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

        {children && !isMobile && (
          <Separator orientation="vertical" className="h-5" />
        )}

        {children}
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
  isMobile,
  withRefresh,
}: TableProps<TData> &
  Pick<ToolBoxProps, "withRefresh"> & { isMobile: boolean }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Columns3 /> {messages.actions.view}
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
}: TableProps<TData> & { className?: string }) {
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

function Search<TData>({
  table,
  placeholder = "Cari...",
  className,
}: TableProps<TData> & { placeholder?: string; className?: string }) {
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
  isMobile,
  className,
}: TableProps<TData> & { isMobile: boolean; className?: string }) {
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

function RowsPerPage<TData>({
  table,
  isMobile,
  rowsLimitArr,
  className,
}: TableProps<TData> & {
  rowsLimitArr: number[];
  isMobile: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      <Label>Baris per halaman</Label>
      <Select
        value={String(table.getState().pagination.pageSize ?? defaultRowsLimit)}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger size={isMobile ? "default" : "sm"}>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {rowsLimitArr.map((item) => (
            <SelectItem key={item} value={String(item)}>
              {formatNumber(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

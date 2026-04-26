import { formatNumber } from "@/core/utils/formaters";
import { cn } from "@/core/utils/helpers";
import { flexRender, Row, Table as TableType } from "@tanstack/react-table";
import {
  DataControllerOptions,
  useDataController,
} from "../hooks/use-data-controller";
import { useIsMobile } from "../hooks/use-media-query";
import { messages } from "../messages";
import {
  DataControllerPageSize,
  DataControllerPaginationNav,
  DataControllerSearch,
  DataControllerSorting,
  DataControllerVisibility,
} from "./data-controller";
import {
  ActiveFilters,
  ActiveFiltersContainer,
  ClearFilters,
  FilterSelector,
  ResetFilters,
} from "./filters";
import { ButtonGroup } from "./ui/button-group";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type DataTableProps<TData> = {
  caption?: string;
  placeholder?: {
    table?: string;
    search?: string;
  };

  className?: string;
  classNames?: {
    toolbox?: string;
    filterContainer?: string;
    tableContainer?: string;
    table?: string;
    footer?: string;
  };

  renderRowSelectionButton?: (props: {
    rows: Row<TData>[];
    table: TableType<TData>;
  }) => React.ReactNode;
};

export function DataTable<TData>({
  caption,
  placeholder,

  className,
  classNames,

  renderRowSelectionButton,
  ...options
}: DataControllerOptions<TData> & DataTableProps<TData>) {
  const isMobile = useIsMobile();
  const { result, table, columns } = useDataController(options);

  const { data, isLoading } = result;

  const state = table.getState();
  const pageCount = table.getPageCount();

  const selectedRowsCount =
    Object.keys(state.rowSelection).length ??
    table.getFilteredSelectedRowModel().rows.length;

  const rowsLength = table.getFilteredRowModel().rows.length;
  const rowsCount = data?.success
    ? (data?.count?.total ?? rowsLength)
    : rowsLength;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const isSelected = selectedRows.length > 0;

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <div
        className={cn(
          "flex w-full flex-col gap-2 lg:flex-row lg:justify-between",
          className,
        )}
      >
        <div className={cn("flex flex-col gap-2 lg:flex-row lg:items-center")}>
          <ButtonGroup className="w-full lg:w-fit **:[button]:grow">
            <FilterSelector table={table} align="start" disabled={isLoading} />
            <DataControllerSorting table={table} disabled={isLoading} />
            <DataControllerVisibility
              table={table}
              align={isMobile ? "end" : "center"}
              disabled={isLoading}
            />
          </ButtonGroup>

          {isSelected && !isMobile && (
            <Separator orientation="vertical" className="h-4" />
          )}

          {isSelected &&
            renderRowSelectionButton?.({ table, rows: selectedRows })}
        </div>

        <div className="flex gap-x-2 *:grow">
          <ResetFilters table={table} disabled={isLoading} />
          <DataControllerSearch
            table={table}
            placeholder={placeholder?.search}
            disabled={isLoading}
          />
        </div>
      </div>

      {state.columnFilters.length > 0 && (
        <ActiveFiltersContainer className={classNames?.filterContainer}>
          <ClearFilters table={table} />
          <Separator orientation="vertical" className="h-4" />
          <ActiveFilters table={table} />
        </ActiveFiltersContainer>
      )}

      <Table
        className={classNames?.table}
        containerClassName={cn("rounded-xl border", classNames?.tableContainer)}
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
            Array.from({ length: state.pagination.pageSize }).map((_, i) => (
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
                {placeholder?.table ?? messages.empty}
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
        <div className="order-4 flex items-center gap-x-2 lg:order-1">
          <Label className="shrink-0">Baris per halaman</Label>
          <DataControllerPageSize table={table} disabled={isLoading} />
        </div>

        <small className="text-muted-foreground order-3 shrink-0 lg:order-2">
          {formatNumber(selectedRowsCount)} dari{" "}
          {isLoading ? "?" : formatNumber(rowsCount)} baris dipilih
        </small>

        <small className="text-muted-foreground order-1 mx-auto text-sm lg:order-3">
          {caption}
        </small>

        <small className="order-2 shrink-0 tabular-nums lg:order-4">
          Halaman{" "}
          {isLoading ? "?" : formatNumber(state.pagination.pageIndex + 1)} dari{" "}
          {isLoading ? "?" : formatNumber(pageCount > 0 ? pageCount : 1)}
        </small>

        <DataControllerPaginationNav
          table={table}
          size="icon"
          className="order-3 shrink-0 lg:order-5"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

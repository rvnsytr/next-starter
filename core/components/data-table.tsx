"use client";

import { ErrorFallback, LoadingFallback } from "@/shared/components/fallback";
import { Hotkey } from "@tanstack/react-hotkeys";
import { flexRender, Row, Table as TableType } from "@tanstack/react-table";
import {
  DataControllerOptions,
  DataControllerResponse,
  QueryDataControllerOptions,
  useDataController,
  useQueryDataController,
} from "../hooks/use-data-controller";
import { useIsMounted } from "../hooks/use-is-mounted";
import { useIsDesktop } from "../hooks/use-media-query";
import { messages } from "../messages";
import { cn, formatNumber } from "../utils";
import {
  ActiveFilters,
  ActiveFiltersContainer,
  ClearFilters,
  FilterSelector,
  PageSize,
  Pagination,
  ResetFilters,
  Search,
  Sorting,
  Visibility,
} from "./controllers";
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

export type BaseDataTableProps = {
  caption?: string;
  placeholder?: {
    table?: string;
    search?: string;
  };

  className?: string;
  classNames?: {
    toolbox?: string;
    activeFiltersContainer?: string;
    tableContainer?: string;
    table?: string;
    footer?: string;
  };
  shortcuts?: {
    filter?: Hotkey;
    sort?: Hotkey;
    view?: Hotkey;
    reset?: Hotkey;
    search?: Hotkey;
  };

  /** Makes the table stretch edge-to-edge on mobile devices by compensating the horizontal padding of PageContainer. */
  fullWidthOnMobile?: boolean;
};

export type DataTableActionProps<TData> = {
  onRowClick?: (row: Row<TData>) => void;
  renderRowSelectionButton?: (props: {
    rows: Row<TData>[];
    table: TableType<TData>;
  }) => React.ReactNode;
};

export type DataTableProps<TData> = BaseDataTableProps &
  DataTableActionProps<TData>;

function BaseDataTable<TData>({
  caption,
  placeholder,
  className,
  classNames,
  shortcuts,
  fullWidthOnMobile = false,
  onRowClick,
  renderRowSelectionButton,
  controller: { result, table, columns },
}: DataTableProps<TData> & { controller: DataControllerResponse<TData> }) {
  const isDesktop = useIsDesktop();
  const isMounted = useIsMounted();

  if (result.error) return <ErrorFallback error={result.error} />;
  if (!isMounted) return <LoadingFallback variant="frame" />;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const isSelected = selectedRows.length > 0;

  const rowsCount =
    result.data?.count?.total ?? table.getFilteredRowModel().rows.length;
  const selectedRowsCount =
    Object.keys(table.getState().rowSelection).length ??
    table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className={cn("relative flex flex-col gap-y-4", className)}>
      <div
        className={cn(
          "flex w-full flex-col gap-2 lg:flex-row lg:justify-between",
          fullWidthOnMobile && "px-4 lg:px-0",
          classNames?.toolbox,
        )}
      >
        <div className={cn("flex flex-col gap-2 lg:flex-row lg:items-center")}>
          <ButtonGroup className="w-full lg:w-fit **:[button]:grow">
            <FilterSelector
              table={table}
              align="start"
              shortcut={shortcuts?.filter}
            />
            <Sorting table={table} shortcut={shortcuts?.sort} />
            <Visibility
              table={table}
              align={isDesktop ? "center" : "end"}
              shortcut={shortcuts?.view}
            />
          </ButtonGroup>

          {isSelected && isDesktop && (
            <Separator orientation="vertical" className="h-4" />
          )}

          {isSelected &&
            renderRowSelectionButton?.({ table, rows: selectedRows })}
        </div>

        <div className="flex gap-x-2 *:grow">
          <ResetFilters table={table} shortcut={shortcuts?.reset} />
          <Search
            table={table}
            placeholder={placeholder?.search}
            shortcut={shortcuts?.search}
          />
        </div>
      </div>

      {table.getState().columnFilters.length > 0 && (
        <ActiveFiltersContainer
          className={cn(
            fullWidthOnMobile && "px-4 lg:px-0",
            classNames?.activeFiltersContainer,
          )}
        >
          <ClearFilters table={table} />
          <Separator orientation="vertical" className="h-4" />
          <ActiveFilters table={table} />
        </ActiveFiltersContainer>
      )}

      <Table
        containerClassName={cn(
          fullWidthOnMobile
            ? "border-y lg:rounded-xl lg:border-x"
            : "rounded-xl border",
          classNames?.tableContainer,
        )}
        className={classNames?.table}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, headerIndex) => {
                const columnPinned = header.column.getIsPinned();
                const isFullwidthFirst = fullWidthOnMobile && headerIndex === 0;
                const isFullwidthLast =
                  fullWidthOnMobile &&
                  headerIndex === headerGroup.headers.length - 1;
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "z-10 text-center",
                      columnPinned && "bg-background/90 sticky z-20",
                      columnPinned === "left" && "left-0",
                      columnPinned === "right" && "right-0",
                    )}
                    style={{
                      left: header.column.getStart("left"),
                      right: header.column.getAfter("right"),
                    }}
                  >
                    {!header.isPlaceholder && (
                      <div
                        className={cn(
                          isFullwidthFirst && "pl-4 lg:pl-0",
                          isFullwidthLast && "pr-4 lg:pr-0",
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {!result.data && result.isLoading ? (
            Array.from({ length: table.getState().pagination.pageSize }).map(
              (_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={columns.length}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ),
            )
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "group/row",
                  !!onRowClick && "z-0 cursor-pointer select-none",
                )}
                onClick={(e) => {
                  if (!onRowClick) return;
                  const target = e.target as HTMLElement;
                  if (target.closest("[data-no-row-click]")) return;
                  onRowClick(row);
                }}
              >
                {row.getVisibleCells().map((cell, cellIndex) => {
                  const columnPinned = cell.column.getIsPinned();
                  const isFullwidthFirst = fullWidthOnMobile && cellIndex === 0;
                  const isFullwidthLast =
                    fullWidthOnMobile &&
                    cellIndex === row.getVisibleCells().length - 1;
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "z-10",
                        columnPinned && "bg-background/90 sticky z-20",
                        columnPinned === "left" && "left-0",
                        columnPinned === "right" && "right-0",
                      )}
                      style={{
                        left: cell.column.getStart("left"),
                        right: cell.column.getAfter("right"),
                      }}
                    >
                      <div
                        className={cn(
                          isFullwidthFirst && "pl-4 lg:pl-0",
                          isFullwidthLast && "pr-4 lg:pr-0",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground px-0 py-4 text-center whitespace-pre-line"
              >
                <div className="sticky inset-y-0 left-0 w-screen lg:static lg:w-auto">
                  {placeholder?.table ?? messages.empty}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div
        className={cn(
          "flex w-full flex-col items-center gap-4 text-center lg:flex-row",
          fullWidthOnMobile && "px-4 lg:px-0",
          classNames?.footer,
        )}
      >
        <div
          data-slot="pagination"
          className="order-4 flex items-center gap-x-2 lg:order-1"
        >
          <Label className="shrink-0">Baris per halaman</Label>
          <PageSize table={table} />
        </div>

        <small
          data-slot="selected-rows"
          className="text-muted-foreground order-3 shrink-0 lg:order-2"
        >
          {formatNumber(selectedRowsCount)} dari{" "}
          {result.isLoading ? "?" : formatNumber(rowsCount)} baris dipilih
        </small>

        {caption ? (
          <small
            data-slot="caption"
            className="text-muted-foreground order-1 mx-auto text-sm lg:order-3"
          >
            {caption}
          </small>
        ) : (
          isDesktop && <div className="order-3 mx-auto" />
        )}

        <small
          data-slot="page-info"
          className="order-2 shrink-0 tabular-nums lg:order-4"
        >
          Halaman{" "}
          {result.isLoading
            ? "?"
            : formatNumber(table.getState().pagination.pageIndex + 1)}{" "}
          dari{" "}
          {result.isLoading
            ? "?"
            : formatNumber(table.getPageCount() > 0 ? table.getPageCount() : 1)}
        </small>

        <Pagination
          data-slot="pagination-nav"
          table={table}
          size="icon"
          className="order-3 lg:order-5"
        />
      </div>
    </div>
  );
}

export function DataTable<TData>({
  caption,
  placeholder,
  className,
  classNames,
  shortcuts,
  fullWidthOnMobile,
  onRowClick,
  renderRowSelectionButton,
  ...options
}: DataTableProps<TData> & DataControllerOptions<TData>) {
  const controller = useDataController(options);
  return (
    <BaseDataTable
      caption={caption}
      placeholder={placeholder}
      className={className}
      classNames={classNames}
      shortcuts={shortcuts}
      fullWidthOnMobile={fullWidthOnMobile}
      onRowClick={onRowClick}
      renderRowSelectionButton={renderRowSelectionButton}
      controller={controller}
    />
  );
}

export function QueryDataTable<TData>({
  caption,
  placeholder,
  className,
  classNames,
  shortcuts,
  fullWidthOnMobile,
  onRowClick,
  renderRowSelectionButton,
  ...options
}: DataTableProps<TData> & QueryDataControllerOptions<TData>) {
  const controller = useQueryDataController(options);
  return (
    <BaseDataTable
      caption={caption}
      placeholder={placeholder}
      className={className}
      classNames={classNames}
      shortcuts={shortcuts}
      fullWidthOnMobile={fullWidthOnMobile}
      onRowClick={onRowClick}
      renderRowSelectionButton={renderRowSelectionButton}
      controller={controller}
    />
  );
}

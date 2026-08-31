import { Skeleton } from "@/core/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { TableProps } from "@/core/modules/table/types";
import { cn } from "@/core/utils";
import { messages } from "@/shared/messages";
import { useMemo } from "react";
import { TableResizeCursor } from "../base/table-resize-cursor";

export function DataTable({
  caption,
  placeholder,
  style,
  ...props
}: TableProps) {
  const table = dataTable.useTableContext();

  const isLoading = useMemo(
    () => table.options.meta?.loading ?? false,
    [table.options.meta?.loading],
  );

  const allLeafColumnsLength = useMemo(
    () => table.getAllLeafColumns().length,
    [table],
  );

  const withResizeIndicator = useMemo(
    () => table.options.columnResizeMode !== "onChange",
    [table.options.columnResizeMode],
  );

  return (
    <Table style={{ width: table.getTotalSize(), ...style }} {...props}>
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <table.Subscribe
            key={headerGroup.id}
            selector={(s) => s.columnResizing}
          >
            {(resizing) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((h) => (
                  <table.AppHeader key={h.id} header={h}>
                    {(header) => {
                      if (header.rowSpan <= 0) return null;

                      const {
                        style: headerStyle,
                        className: headerClassName,
                        ...restHeaderProps
                      } = header.column.columnDef.meta?.headerProps ?? {};

                      const pinPosition = header.column.getIsPinned();

                      const isResizing =
                        withResizeIndicator && header.column.getIsResizing();

                      return (
                        <>
                          <table.Subscribe
                            selector={(s) =>
                              !!s.columnResizing.isResizingColumn
                            }
                          >
                            {(s) => <TableResizeCursor resizing={s} />}
                          </table.Subscribe>

                          <TableHead
                            key={header.id}
                            data-pinned={!!pinPosition}
                            colSpan={header.colSpan}
                            rowSpan={header.rowSpan}
                            style={{
                              ...headerStyle,
                              width: header.getSize(),
                              left: header.column.getStart("start"),
                              right: header.column.getAfter("end"),
                            }}
                            className={cn(
                              "relative z-10",

                              !!pinPosition && "bg-background/90 sticky z-20",
                              pinPosition === "start" && "left-0 pl-4",
                              pinPosition === "end" && "right-0 pr-4",

                              headerClassName,
                            )}
                            {...restHeaderProps}
                          >
                            <header.FlexRender />

                            {header.column.getCanResize() && (
                              <>
                                <div
                                  onMouseDown={header.getResizeHandler()}
                                  onTouchStart={header.getResizeHandler()}
                                  onDoubleClick={() =>
                                    header.column.resetSize()
                                  }
                                  className="absolute top-0 right-0 h-full w-2 cursor-col-resize touch-none select-none"
                                />

                                {isResizing && (
                                  <div
                                    style={{
                                      transform: `translateX(${resizing.deltaOffset ?? 0}px)`,
                                    }}
                                    className="border-primary pointer-events-none absolute top-0 right-0 h-full w-px border-r border-dashed"
                                  />
                                )}
                              </>
                            )}
                          </TableHead>
                        </>
                      );
                    }}
                  </table.AppHeader>
                ))}
              </TableRow>
            )}
          </table.Subscribe>
        ))}
      </TableHeader>

      <TableBody>
        {isLoading ? (
          Array.from({ length: table.state.pagination.pageSize }).map(
            (_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={allLeafColumnsLength}>
                  <Skeleton className="h-7 w-full" />
                </TableCell>
              </TableRow>
            ),
          )
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-selected={row.getIsSelected()}>
              {row.getVisibleCells().map((c) => (
                <table.AppCell key={c.id} cell={c}>
                  {(cell) => {
                    const cellPropsMeta = cell.column.columnDef.meta?.cellProps;
                    const cellProps =
                      typeof cellPropsMeta === "function"
                        ? cellPropsMeta(cell.getValue())
                        : cellPropsMeta;

                    const {
                      style: cellStyle,
                      className: cellClassName,
                      ...restCellProps
                    } = cellProps ?? {};

                    const pinPosition = cell.column.getIsPinned();

                    return (
                      <TableCell
                        key={cell.id}
                        data-pinned={!!pinPosition}
                        style={{
                          ...cellStyle,
                          width: cell.column.getSize(),
                          left: cell.column.getStart("start"),
                          right: cell.column.getAfter("end"),
                        }}
                        className={cn(
                          "z-10",

                          !!pinPosition && "bg-background/90 sticky z-20",
                          pinPosition === "start" && "left-0 pl-4",
                          pinPosition === "end" && "right-0 pr-4",

                          cellClassName,
                        )}
                        {...restCellProps}
                      >
                        <cell.FlexRender />
                      </TableCell>
                    );
                  }}
                </table.AppCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={allLeafColumnsLength}
              className="text-muted-foreground py-4 text-center whitespace-pre-line"
            >
              {placeholder ?? messages.empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      <TableFooter>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={allLeafColumnsLength}>
              <Skeleton className="h-7 w-full" />
            </TableCell>
          </TableRow>
        ) : (
          table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((f) => (
                <table.AppFooter key={f.id} header={f}>
                  {(footer) => {
                    if (footer.isPlaceholder) return null;

                    const {
                      isPlaceholder,
                      rowSpan = footer.rowSpan,
                      colSpan = footer.colSpan,
                      style: footerStyle,
                      className: footerClassName,
                      ...restFooterProps
                    } = footer.column.columnDef.meta?.footerProps ?? {};

                    const pinPosition = footer.column.getIsPinned();
                    if (!pinPosition && isPlaceholder) return null;

                    return (
                      <TableCell
                        key={footer.id}
                        data-pinned={!!pinPosition}
                        rowSpan={rowSpan}
                        colSpan={colSpan}
                        style={{
                          ...footerStyle,
                          width: footer.getSize(),
                          left: footer.column.getStart("start"),
                          right: footer.column.getAfter("end"),
                        }}
                        className={cn(
                          "relative z-10",

                          !!pinPosition && "sticky z-20 backdrop-blur-xs",
                          pinPosition === "start" && "left-0 pl-4",
                          pinPosition === "end" && "right-0 pr-4",

                          footerClassName,
                        )}
                        {...restFooterProps}
                      >
                        <footer.FlexRender />
                      </TableCell>
                    );
                  }}
                </table.AppFooter>
              ))}
            </TableRow>
          ))
        )}
      </TableFooter>
    </Table>
  );
}

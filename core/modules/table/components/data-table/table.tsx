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
import { TableRowSkeleton } from "@/core/modules/table/components/base/table-row-skeleton";
import { TABLE_CELL_CLASS } from "@/core/modules/table/constants";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { TableProps } from "@/core/modules/table/types";
import { messages } from "@/shared/messages";
import { cn } from "cn";
import { useMemo } from "react";
import { TableResizeCursor } from "../base/table-resize-cursor";

export function DataTable({
  caption,
  placeholder,
  style,
  ...props
}: TableProps) {
  const table = dataTable.useTableContext();

  const isLoading = table.options.meta?.loading ?? false;
  const withResizeIndicator = table.options.columnResizeMode !== "onChange";

  const { columnLength, hasFooter } = useMemo(() => {
    const leafColumns = table.getAllLeafColumns();
    return {
      columnLength: leafColumns.length,
      hasFooter: leafColumns.some((column) => !!column.columnDef.footer),
    };
  }, [table]);

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
                              TABLE_CELL_CLASS.base,

                              !!pinPosition && TABLE_CELL_CLASS.pin,
                              pinPosition === "start" &&
                                TABLE_CELL_CLASS.pinLeft,
                              pinPosition === "end" &&
                                TABLE_CELL_CLASS.pinRight,

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
                                  className={TABLE_CELL_CLASS.resizeHandler}
                                />

                                {isResizing && (
                                  <div
                                    style={{
                                      transform: `translateX(${resizing.deltaOffset ?? 0}px)`,
                                    }}
                                    className={TABLE_CELL_CLASS.resizeIndicator}
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
            (_, i) => <TableRowSkeleton key={i} columnLength={columnLength} />,
          )
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-selected={row.getIsSelected()}>
              {row.getVisibleCells().map((c) => (
                <table.AppCell key={c.id} cell={c}>
                  {(cell) => {
                    const columnMeta = cell.column.columnDef.meta;

                    const cellProps =
                      typeof columnMeta?.cellProps === "function"
                        ? columnMeta.cellProps(cell.getValue())
                        : columnMeta?.cellProps;

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
                          TABLE_CELL_CLASS.base,

                          !!pinPosition && TABLE_CELL_CLASS.pin,
                          pinPosition === "start" && TABLE_CELL_CLASS.pinLeft,
                          pinPosition === "end" && TABLE_CELL_CLASS.pinRight,

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
              colSpan={columnLength}
              className={TABLE_CELL_CLASS.empty}
            >
              {placeholder ?? messages.empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      {hasFooter && (
        <TableFooter>
          {isLoading ? (
            <TableRowSkeleton columnLength={columnLength} />
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
                            TABLE_CELL_CLASS.base,

                            !!pinPosition && TABLE_CELL_CLASS.pinFooter,
                            pinPosition === "start" && TABLE_CELL_CLASS.pinLeft,
                            pinPosition === "end" && TABLE_CELL_CLASS.pinRight,

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
      )}
    </Table>
  );
}

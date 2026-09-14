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
import { TABLE_CELL_CLASS } from "@/core/modules/table/constants";
import { dataController } from "@/core/modules/table/hooks/data-controller";
import { TableProps } from "@/core/modules/table/types";
import { messages } from "@/shared/messages";
import { cn } from "cn";
import { useMemo } from "react";

export function DataControllerTable({
  caption,
  placeholder,
  ...props
}: TableProps) {
  const table = dataController.useTableContext();

  const isLoading = useMemo(
    () => table.options.meta?.loading ?? false,
    [table.options.meta?.loading],
  );

  const { columnLength, hasFooter } = useMemo(() => {
    const leafColumns = table.getAllLeafColumns();
    return {
      columnLength: leafColumns.length,
      hasFooter: leafColumns.some((column) => !!column.columnDef.footer),
    };
  }, [table]);

  return (
    <Table {...props}>
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((h) => (
              <table.AppHeader key={h.id} header={h}>
                {(header) => {
                  if (header.rowSpan <= 0) return null;

                  const { className: headerClassName, ...restHeaderProps } =
                    header.column.columnDef.meta?.headerProps ?? {};

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      rowSpan={header.rowSpan}
                      className={cn(TABLE_CELL_CLASS.base, headerClassName)}
                      {...restHeaderProps}
                    >
                      <header.FlexRender />
                    </TableHead>
                  );
                }}
              </table.AppHeader>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {isLoading ? (
          Array.from({ length: table.state.pagination.pageSize }).map(
            (_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={columnLength}>
                  <Skeleton className={TABLE_CELL_CLASS.skeleton} />
                </TableCell>
              </TableRow>
            ),
          )
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-selected={row.getIsSelected()}>
              {row.getAllCells().map((c) => (
                <table.AppCell key={c.id} cell={c}>
                  {(cell) => {
                    const columnMeta = cell.column.columnDef.meta;

                    const cellProps =
                      typeof columnMeta?.cellProps === "function"
                        ? columnMeta.cellProps(cell.getValue())
                        : columnMeta?.cellProps;

                    const { className: cellClassName, ...restCellProps } =
                      cellProps ?? {};

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(TABLE_CELL_CLASS.base, cellClassName)}
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
            <TableRow>
              <TableCell colSpan={columnLength}>
                <Skeleton className={TABLE_CELL_CLASS.skeleton} />
              </TableCell>
            </TableRow>
          ) : (
            table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((f) => (
                  <table.AppFooter key={f.id} header={f}>
                    {(footer) => {
                      const {
                        isPlaceholder,
                        rowSpan = footer.rowSpan,
                        colSpan = footer.colSpan,
                        className: footerClassName,
                        ...restFooterProps
                      } = footer.column.columnDef.meta?.footerProps ?? {};

                      if (footer.isPlaceholder || isPlaceholder) return null;

                      return (
                        <TableCell
                          key={footer.id}
                          rowSpan={rowSpan}
                          colSpan={colSpan}
                          className={cn(TABLE_CELL_CLASS.base, footerClassName)}
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

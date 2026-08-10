"use client";

import { Skeleton } from "@/core/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { cn } from "@/core/utils";
import { messages } from "@/shared/messages";
import { useEffect } from "react";

export type BaseTableProps = React.ComponentProps<typeof Table> & {
  /** The caption for the table. */
  caption?: string;

  /** The placeholder message to display when the table has no data. */
  placeholder?: string;

  /** Whether the table is in a loading state. */
  loading?: boolean;
};

export function BaseTable({
  caption,
  placeholder,
  loading = false,
  style,
  ...props
}: BaseTableProps) {
  const table = dataTable.useTableContext();

  const allLeafColumnsLength = table.getAllLeafColumns().length;
  const resizing = table.atoms.columnResizing.get();
  const withResizeIndicator = table.options.columnResizeMode !== "onChange";

  useEffect(() => {
    const isResizing = !!resizing.isResizingColumn;
    document.body.style.cursor = isResizing ? "col-resize" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [resizing]);

  return (
    <Table style={{ width: table.getTotalSize(), ...style }} {...props}>
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
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
                    <TableHead
                      key={header.id}
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
                            onDoubleClick={() => header.column.resetSize()}
                            className="absolute top-0 right-0 h-full w-2 cursor-col-resize touch-none select-none"
                          />

                          {isResizing && (
                            <div
                              className="border-primary pointer-events-none absolute top-0 right-0 h-full w-px border-r border-dashed"
                              style={{
                                transform: `translateX(${resizing.deltaOffset ?? 0}px)`,
                              }}
                            />
                          )}
                        </>
                      )}
                    </TableHead>
                  );
                }}
              </table.AppHeader>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {loading ? (
          Array.from({ length: table.atoms.pagination.get().pageSize }).map(
            (_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={allLeafColumnsLength}>
                  <Skeleton className="h-8 w-full" />
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
                    // const isSelected = cell.getIsSelected();
                    // const edges = cell.getSelectionEdges();

                    const {
                      style: cellStyle,
                      className: cellClassName,
                      ...restCellProps
                    } = cell.column.columnDef.meta?.cellProps ?? {};

                    const pinPosition = cell.column.getIsPinned();

                    return (
                      <TableCell
                        key={cell.id}
                        // onMouseDown={(e) => {
                        //   e.stopPropagation();
                        //   cell.getSelectionStartHandler();
                        // }}
                        // onMouseEnter={(e) => {
                        //   e.stopPropagation();
                        //   cell.getSelectionExtendHandler();
                        // }}
                        // className={cn(
                        //   isSelected && "bg-muted",
                        //   cell.getIsFocused() && "ring-ring ring-1 outline-none",
                        //   edges.left && "border-l",
                        // )}
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
              className="text-muted-foreground px-0 py-4 text-center whitespace-pre-line"
            >
              {placeholder ?? messages.empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

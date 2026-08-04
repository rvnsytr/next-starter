"use client";

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
import { BaseTableProps } from "@/core/modules/table/types";
import { cn } from "@/core/utils";
import { messages } from "@/shared/messages";

export function DataTable({
  caption,
  placeholder,
  style,
  ...props
}: BaseTableProps) {
  const table = dataTable.useTableContext();

  return (
    <Table
      style={{
        width: table.getTotalSize(),
        ...style,
      }}
      {...props}
    >
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((h) => (
              <table.AppHeader key={h.id} header={h}>
                {(header) => {
                  if (header.rowSpan <= 0) return null;

                  const pinPosition = header.column.getIsPinned();
                  const isPinned = !!pinPosition;

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      rowSpan={header.rowSpan}
                      style={{
                        width: header.getSize(),
                        left: header.column.getStart("start"),
                        right: header.column.getAfter("end"),
                      }}
                      className={cn(
                        "relative z-10",

                        isPinned && "bg-background/90 sticky z-20",
                        pinPosition === "start" && "left-0 pl-4",
                        pinPosition === "end" && "right-0 pr-4",
                      )}
                    >
                      <header.FlexRender />

                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onDoubleClick={() => header.column.resetSize()}
                          className="absolute top-0 right-0 flex h-full w-2 cursor-col-resize touch-none justify-between gap-px select-none"
                        />
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
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-selected={row.getIsSelected()}>
              {row.getVisibleCells().map((cell) => (
                <table.AppCell key={cell.id} cell={cell}>
                  {(cell) => {
                    // const isSelected = cell.getIsSelected();
                    // const edges = cell.getSelectionEdges();

                    const pinPosition = cell.column.getIsPinned();
                    const isPinned = !!pinPosition;

                    return (
                      <TableCell
                        key={cell.id}
                        // onMouseDown={cell.getSelectionStartHandler()}
                        // onMouseEnter={cell.getSelectionExtendHandler()}
                        // className={cn(
                        //   isSelected && "bg-muted",
                        //   cell.getIsFocused() && "ring-ring ring-1 outline-none",
                        //   edges.left && "border-l",
                        // )}
                        style={{
                          width: cell.column.getSize(),
                          left: cell.column.getStart("start"),
                          right: cell.column.getAfter("end"),
                        }}
                        className={cn(
                          "z-10",

                          isPinned && "bg-background/90 sticky z-20",
                          pinPosition === "start" && "left-0 pl-4",
                          pinPosition === "end" && "right-0 pr-4",
                        )}
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
              colSpan={table.getAllColumns().length}
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

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
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      rowSpan={header.rowSpan}
                      style={{ width: header.getSize() }}
                      className="relative"
                    >
                      <header.FlexRender />

                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="absolute top-0 right-0 flex h-full w-1 cursor-col-resize touch-none justify-between gap-px select-none"
                        >
                          <div className="bg-border h-full w-px" />
                          <div className="not-in-data-[variant=bordered]:hidden" />
                        </div>
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
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <table.AppCell key={cell.id} cell={cell}>
                  {(cell) => {
                    // const isSelected = cell.getIsSelected();
                    // const edges = cell.getSelectionEdges();

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
                        style={{ width: cell.column.getSize() }}
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

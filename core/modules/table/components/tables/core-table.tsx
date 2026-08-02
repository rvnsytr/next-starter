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
import { coreTable } from "@/core/modules/table/hooks/core-table";
import { BaseTableProps } from "@/core/modules/table/types";
import { messages } from "@/shared/messages";

export function CoreTable({ caption, placeholder, ...props }: BaseTableProps) {
  const table = coreTable.useTableContext();

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
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      rowSpan={header.rowSpan}
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

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
import { BaseTableProps } from "@/core/modules/table/types";
import { cn } from "@/core/utils";
import { messages } from "@/shared/messages";
import { TableResizeCursor } from "../base/table-resize-cursor";

export function DataTable({
  caption,
  placeholder,
  loading = false,
  style,
  ...props
}: BaseTableProps) {
  const table = dataTable.useTableContext();

  const allLeafColumnsLength = table.getAllLeafColumns().length;
  const withResizeIndicator = table.options.columnResizeMode !== "onChange";

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
                            selector={(s) => {
                              return !!s.columnResizing.isResizingColumn;
                            }}
                          >
                            {(s) => <TableResizeCursor resizing={s} />}
                          </table.Subscribe>

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
                    const {
                      style: cellStyle,
                      className: cellClassName,
                      ...restCellProps
                    } = cell.column.columnDef.meta?.cellProps ?? {};

                    const pinPosition = cell.column.getIsPinned();

                    return (
                      <TableCell
                        key={cell.id}
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

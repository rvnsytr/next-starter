import { ScrollArea } from "@/core/components/ui/scroll-area";
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
import { toast } from "@/core/components/ui/toast";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { BaseTableProps } from "@/core/modules/table/types";
import { cn } from "@/core/utils";
import { messages } from "@/shared/messages";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { CellSelectionBounds, CellSelectionState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { TableResizeCursor } from "../base/table-resize-cursor";

// @see https://tanstack.com/table/latest/docs/framework/react/examples/cell-selection
function escapeTsvValue(value: unknown) {
  const text = value == null ? "" : String(value);
  const safeText =
    typeof value === "string" && /^[\t\r ]*[=+@-]/.test(value)
      ? `'${text}`
      : text;
  return /["\t\n\r]/.test(safeText)
    ? `"${safeText.replace(/"/g, '""')}"`
    : safeText;
}

function toTsv(ranges: unknown[][][]) {
  return ranges
    .map((g) => g.map((r) => r.map(escapeTsvValue).join("\t")).join("\n"))
    .join("\n\n");
}

export function DataGrid({
  caption,
  placeholder,
  loading = false,
  style,
  containerProps,
  ...props
}: BaseTableProps & {
  containerProps?: Omit<React.ComponentProps<typeof ScrollArea>, "ref">;
}) {
  const table = dataGrid.useTableContext();

  const gridRef = useRef<HTMLDivElement>(null);

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

  useHotkeys(
    [
      { hotkey: "ArrowUp", callback: () => table.moveCellSelection("up") },
      { hotkey: "ArrowDown", callback: () => table.moveCellSelection("down") },
      { hotkey: "ArrowLeft", callback: () => table.moveCellSelection("left") },
      {
        hotkey: "ArrowRight",
        callback: () => table.moveCellSelection("right"),
      },
      {
        hotkey: "Shift+ArrowUp",
        callback: () => table.extendCellSelection("up"),
      },
      {
        hotkey: "Shift+ArrowDown",
        callback: () => table.extendCellSelection("down"),
      },
      {
        hotkey: "Shift+ArrowLeft",
        callback: () => table.extendCellSelection("left"),
      },
      {
        hotkey: "Shift+ArrowRight",
        callback: () => table.extendCellSelection("right"),
      },
      { hotkey: "Mod+A", callback: () => table.selectAllCells() },
      { hotkey: "Escape", callback: () => table.resetCellSelection(true) },
      {
        hotkey: "Mod+C",
        callback: () => {
          void navigator.clipboard.writeText(
            toTsv(table.getSelectedCellRangesData()),
          );
        },
      },
    ],
    { target: gridRef },
  );

  return (
    <Table
      style={{ width: table.getTotalSize(), ...style }}
      containerProps={{ ref: gridRef, ...containerProps }}
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
                              style={{
                                transform: `translateX(${resizing.deltaOffset ?? 0}px)`,
                              }}
                              className="border-primary pointer-events-none absolute top-0 right-0 h-full w-px border-r border-dashed"
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
                    const {
                      style: cellStyle,
                      className: cellClassName,
                      ...restCellProps
                    } = cell.column.columnDef.meta?.cellProps ?? {};

                    const pinPosition = cell.column.getIsPinned();

                    const canSelect = cell.getCanSelect();

                    const isSelected = cell.getIsSelected();
                    const isFocused = cell.getIsFocused();
                    const edges = isSelected ? cell.getSelectionEdges() : null;

                    return (
                      <TableCell
                        key={cell.id}
                        data-cell-selected={isSelected}
                        onMouseDown={cell.getSelectionStartHandler()}
                        onMouseEnter={cell.getSelectionExtendHandler()}
                        onDoubleClick={() => {
                          toast.add({ type: "info", title: "Double Click!" });
                        }}
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

                          canSelect &&
                            "cell-selectable cursor-cell select-none",

                          isSelected && "bg-muted dark:bg-muted/50",

                          isFocused && "cell-edge",
                          !isFocused && edges?.top && "cell-edge-top",
                          !isFocused && edges?.right && "cell-edge-right",
                          !isFocused && edges?.bottom && "cell-edge-bottom",
                          !isFocused && edges?.left && "cell-edge-left",

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

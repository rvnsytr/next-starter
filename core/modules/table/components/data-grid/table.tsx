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
import { TableProps } from "@/core/modules/table/types";
import { cn } from "@/core/utils";
import { messages } from "@/shared/messages";
import { useHotkey, useHotkeys } from "@tanstack/react-hotkeys";
import {
  CellData,
  CellSelectionBounds,
  CellSelectionState,
  RowData,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TableResizeCursor } from "../base/table-resize-cursor";
import { CellEditorController } from "./cell-editor-controller";
import { useDataGrid } from "./provider";

export type DataGridEditState = {
  rowId: string;
  columnId: string;
  cellId: string;
};

// @see https://tanstack.com/table/latest/docs/framework/react/guide/cell-selection#copying-a-selection
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

// @see https://tanstack.com/table/latest/docs/framework/react/guide/cell-selection#performance-with-table-subscribe
function rowSelectionKey(
  ranges: CellSelectionState,
  bounds: CellSelectionBounds[],
  rowIndex: number,
  rowId: string,
) {
  const active = ranges[ranges.length - 1];
  let key =
    ranges.length > 0 && active.anchorRowId === rowId
      ? `f${active.anchorColumnId}`
      : "";

  for (const bound of bounds) {
    const self = rowIndex >= bound.minRowIndex && rowIndex <= bound.maxRowIndex;
    const above =
      rowIndex - 1 >= bound.minRowIndex && rowIndex - 1 <= bound.maxRowIndex;
    const below =
      rowIndex + 1 >= bound.minRowIndex && rowIndex + 1 <= bound.maxRowIndex;

    if (self || above || below)
      key += `|${self ? 1 : 0}${above ? 1 : 0}${below ? 1 : 0}:${bound.minColumnIndex}-${bound.maxColumnIndex}`;
  }

  return key;
}

export function DataGrid({
  caption,
  placeholder,
  loading = false,
  style,
  containerProps,
  ...props
}: TableProps & {
  containerProps?: Omit<
    React.ComponentProps<typeof ScrollArea>,
    "ref" | "tabIndex"
  >;
}) {
  const table = dataGrid.useTableContext();
  const tableContext = useDataGrid();
  const tableRef = useRef<HTMLDivElement>(null);

  const [edit, setEdit] = useState<DataGridEditState | null>(null);

  const withResizeIndicator = table.options.columnResizeMode !== "onChange";

  const allLeafColumnsLength = useMemo(() => {
    return table.getAllLeafColumns().length;
  }, [table]);

  const exitEdit = useCallback(() => {
    if (edit) table.setFocusedCell(edit.rowId, edit.columnId);
    tableRef.current?.focus({ preventScroll: true });
    setEdit(null);
  }, [table, edit]);

  useEffect(() => {
    const sub = table.atoms.cellSelection.subscribe(() => {
      if (edit) setEdit(null);
    });

    return () => sub.unsubscribe();
  }, [table, edit]);

  useHotkeys(
    [
      {
        hotkey: "ArrowUp",
        callback: () => table.moveCellSelection("up"),
      },
      {
        hotkey: "ArrowDown",
        callback: () => table.moveCellSelection("down"),
      },
      {
        hotkey: "ArrowLeft",
        callback: () => table.moveCellSelection("left"),
      },
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
      {
        hotkey: "Mod+A",
        callback: () => table.selectAllCells(),
      },
      {
        hotkey: "Mod+C",
        callback: () => {
          void navigator.clipboard.writeText(
            toTsv(table.getSelectedCellRangesData()),
          );
        },
      },
      {
        hotkey: "Enter",
        callback: () => {
          const cellSelectionState = table.state.cellSelection;

          if (cellSelectionState.length > 1) return;

          const cs = cellSelectionState[0];
          const cellId = table.getFocusedCell()?.id;

          if (
            cellId &&
            cs.anchorRowId === cs.focusRowId &&
            cs.anchorColumnId === cs.focusColumnId
          ) {
            const rowId = cs.anchorRowId;
            const columnId = cs.anchorColumnId;
            setEdit({ rowId, columnId, cellId });
          }
        },
      },
      {
        hotkey: "Escape",
        callback: () => table.resetCellSelection(true),
      },
    ],
    { target: tableRef, enabled: !edit },
  );

  useHotkey("Escape", () => exitEdit(), { target: tableRef, enabled: !!edit });

  const onCellEditorSubmit = (
    changes: Record<string, CellData>,
    rowData: RowData,
  ) => {
    if (!edit)
      return toast.add({
        type: "error",
        title: "No cell is being edited.",
        description: "Double click a cell to edit.",
      });

    tableContext.updateRow({ rowId: edit.rowId, data: rowData, changes });

    exitEdit();

    if (table.options.meta?.saveMode === "onChange") {
      const ctx = tableContext.getChanges();
      table.options.meta?.onSave?.(ctx);
      tableContext.clearChanges();
    }
  };

  const { className: containerClassName, ...restContainerProps } =
    containerProps ?? {};

  return (
    <Table
      style={{ width: table.getTotalSize(), ...style }}
      containerProps={{
        ref: tableRef,
        tabIndex: 0,
        className: cn("outline-none", containerClassName),
        ...restContainerProps,
      }}
      {...props}
    >
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <table.Subscribe
            key={headerGroup.id}
            selector={(s) => s.columnResizing}
          >
            {(resizing) => (
              <TableRow>
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
            <table.Subscribe
              key={row.id}
              source={table.atoms.cellSelection}
              selector={(ranges) =>
                rowSelectionKey(
                  ranges,
                  table.getCellSelectionBounds(),
                  row.getDisplayIndex(),
                  row.id,
                )
              }
            >
              {() => {
                const rowChanges = tableContext.getChanges();
                const isRowEdited = rowChanges.updated.some(
                  (r) => r.rowId === row.id,
                );

                return (
                  <TableRow
                    data-selected={row.getIsSelected()}
                    data-row-edited={isRowEdited}
                    className={cn(isRowEdited && "bg-accent/50")}
                  >
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
                          const edges = isSelected
                            ? cell.getSelectionEdges()
                            : null;

                          const editorMeta =
                            cell.column.columnDef.meta?.editor ?? null;

                          const canEdit = !!editorMeta;
                          const isEdit = canEdit && edit?.cellId === cell.id;
                          const isCellEdited = rowChanges.updated.some(
                            (r) =>
                              r.rowId === row.id &&
                              Object.keys(r.changes).includes(cell.column.id),
                          );

                          return (
                            <TableCell
                              key={cell.id}
                              id={cell.id}
                              data-cell-selected={isSelected}
                              onMouseDown={cell.getSelectionStartHandler()}
                              onMouseEnter={cell.getSelectionExtendHandler()}
                              onDoubleClick={() => {
                                table.resetCellSelection(true);
                                setEdit({
                                  rowId: row.id,
                                  columnId: cell.column.id,
                                  cellId: cell.id,
                                });
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

                                isSelected &&
                                  !isCellEdited &&
                                  "bg-muted dark:bg-muted/50",

                                (isFocused || isEdit) && "cell-edge",

                                !isFocused && edges?.top && "cell-edge-top",
                                !isFocused && edges?.right && "cell-edge-right",
                                !isFocused &&
                                  edges?.bottom &&
                                  "cell-edge-bottom",
                                !isFocused && edges?.left && "cell-edge-left",

                                isEdit && "p-0",
                                isCellEdited && !isEdit && "bg-warning/32",

                                cellClassName,
                              )}
                              {...restCellProps}
                            >
                              {isEdit ? (
                                <CellEditorController
                                  meta={editorMeta}
                                  onSubmit={(data) => {
                                    const key = editorMeta.key ?? c.column.id;
                                    const changes = { [key]: data };
                                    onCellEditorSubmit(changes, row.original);
                                  }}
                                />
                              ) : (
                                <cell.FlexRender />
                              )}
                            </TableCell>
                          );
                        }}
                      </table.AppCell>
                    ))}
                  </TableRow>
                );
              }}
            </table.Subscribe>
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

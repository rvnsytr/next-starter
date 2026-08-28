import { ScrollArea } from "@/core/components/ui/scroll-area";
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
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { DataGridEditState, TableProps } from "@/core/modules/table/types";
import {
  getParentColumns,
  hasNestedKey,
  saveChanges,
  setNestedValue,
} from "@/core/modules/table/utils";
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
  const tableRef = useRef<HTMLDivElement>(null);

  const dataGridContext = useDataGrid();

  const [edit, setEdit] = useState<DataGridEditState | null>(null);
  const editRef = useRef<DataGridEditState | null>(null);

  const allLeafColumnsLength = useMemo(
    () => table.getAllLeafColumns().length,
    [table],
  );

  const withResizeIndicator = useMemo(
    () => table.options.columnResizeMode !== "onChange",
    [table.options.columnResizeMode],
  );

  const rowChanges = useMemo(
    () => dataGridContext.getChanges(),
    [dataGridContext],
  );

  const originalData = useMemo(() => {
    const meta = table.options.meta;
    return meta && "original" in meta ? (meta.original as RowData[]) : [];
  }, [table.options.meta]);

  const handleEditAutoSave = useCallback(() => {
    const meta = table.options.meta;

    const currentChanges = dataGridContext.getChanges();
    meta?.onChange?.(currentChanges);

    if (meta?.saveMode === "onChange") saveChanges(dataGridContext, meta);
  }, [table.options.meta, dataGridContext]);

  const exitEdit = useCallback(() => {
    setTimeout(() => {
      if (edit) table.setFocusedCell(edit.rowId, edit.columnId);
      tableRef.current?.focus({ preventScroll: true });
      if (edit) setEdit(null);
    }, 0);
  }, [table, edit]);

  useEffect(() => {
    editRef.current = edit;
  }, [edit]);

  useEffect(() => {
    const sub = table.atoms.cellSelection.subscribe(() => {
      if (editRef.current) setEdit(null);
    });

    return () => sub.unsubscribe();
  }, [table]);

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

          if (cellSelectionState.length !== 1) return;

          const css = cellSelectionState[0];

          const column = table.getColumn(css.anchorColumnId);
          const canEdit = !!column?.columnDef.meta?.editor;

          const cellId = table.getFocusedCell()?.id;

          if (
            canEdit &&
            cellId &&
            css.anchorRowId === css.focusRowId &&
            css.anchorColumnId === css.focusColumnId
          ) {
            const rowId = css.anchorRowId;
            const columnId = css.anchorColumnId;
            setEdit({ rowId, columnId, cellId });
          }
        },
      },
      {
        hotkey: "Escape",
        callback: () => table.resetCellSelection(true),
        options: { conflictBehavior: "allow" },
      },
      {
        hotkey: "Delete",
        callback: () => {
          const { getRowId, meta } = table.options;
          const { newRows, getChanges, removeRows } = dataGridContext;

          const rowIds = table.getCellSelectionRowIds();
          const addedRows = newRows.form.getValues("rows");

          const removedRows = rowIds
            .map((rowId) => ({ rowId, rowData: table.getRow(rowId).original }))
            .filter((row) => {
              const addedRowIndex = addedRows.findIndex(
                (r, i) => getRowId?.(r, i) === row.rowId,
              );

              const isAddedRow = addedRowIndex >= 0;
              if (isAddedRow) newRows.fieldArray.remove(addedRowIndex);

              return !isAddedRow;
            });

          removeRows(removedRows);

          const hasAddedRows = rowIds.length !== removedRows.length;
          if (hasAddedRows) {
            const currentChanges = getChanges();
            meta?.onChange?.(currentChanges);
          }
        },
      },
    ],
    { target: tableRef, enabled: !edit },
  );

  useHotkey("Escape", () => exitEdit(), {
    target: tableRef,
    enabled: !!edit,
    conflictBehavior: "allow",
  });

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
                            selector={(s) =>
                              !!s.columnResizing.isResizingColumn
                            }
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

                              !!pinPosition && "sticky z-20",
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
            <table.Subscribe
              key={row.id}
              source={table.atoms.cellSelection}
              selector={(ranges) => {
                return rowSelectionKey(
                  ranges,
                  table.getCellSelectionBounds(),
                  row.getDisplayIndex(),
                  row.id,
                );
              }}
            >
              {() => {
                const isOriginalRow = originalData.some((r, i) => {
                  const rowId = table.options.getRowId?.(r, i);
                  return row.id === rowId;
                });

                const isRowEdited = rowChanges.updated.some(
                  (r) => r.rowId === row.id,
                );

                const isRowRemoved = rowChanges.removed.some(
                  (r) => r.rowId === row.id,
                );

                return (
                  <TableRow
                    data-selected={row.getIsSelected()}
                    className={cn(
                      !isOriginalRow &&
                        "bg-success/32 hover:bg-success/32 not-in-data-[variant=card]:data-selected:bg-success/32",
                      isRowEdited && "bg-accent/50",
                      isRowRemoved &&
                        "bg-destructive/32 hover:bg-destructive/32 not-in-data-[variant=card]:data-selected:bg-destructive/32",
                    )}
                  >
                    {row.getVisibleCells().map((c) => (
                      <table.AppCell key={c.id} cell={c}>
                        {(cell) => {
                          const columnMeta = cell.column.columnDef.meta;

                          const {
                            style: cellStyle,
                            className: cellClassName,
                            ...restCellProps
                          } = columnMeta?.cellProps ?? {};

                          const pinPosition = cell.column.getIsPinned();

                          const canSelect = cell.getCanSelect();

                          const isSelected = cell.getIsSelected();
                          const isFocused = cell.getIsFocused();
                          const edges = isSelected
                            ? cell.getSelectionEdges()
                            : null;

                          const editorMeta = columnMeta?.editor ?? null;

                          const canEdit = !!editorMeta;
                          const isEdit = canEdit && edit?.cellId === cell.id;
                          const isCellEdited = rowChanges.updated.some(
                            (r) =>
                              r.rowId === row.id &&
                              hasNestedKey(r.changes, cell.column.id),
                          );

                          const onCellEditorSubmit = (data: CellData) => {
                            if (!isEdit) return;

                            const { newRows, updateRow } = dataGridContext;
                            const addedRows = newRows.form.getValues("rows");

                            const rowId = edit.rowId;
                            const rowData = row.original;

                            let keys = editorMeta.key ? [editorMeta.key] : [];
                            if (!keys.length) {
                              keys = [
                                ...getParentColumns(c.column).map(
                                  (pc) =>
                                    pc.columnDef.meta?.editor?.key ?? pc.id,
                                ),
                                cell.column.id,
                              ];
                            }

                            if (isOriginalRow) {
                              const changes = { [keys.join(".")]: data };
                              updateRow({ rowId, rowData, changes });
                            } else {
                              const addedRowIndex = addedRows.findIndex(
                                (r, i) =>
                                  table.options.getRowId?.(r, i) === row.id,
                              );

                              if (addedRowIndex >= 0) {
                                const updated = setNestedValue(
                                  rowData,
                                  keys,
                                  data,
                                );

                                newRows.fieldArray.update(
                                  addedRowIndex,
                                  updated,
                                );
                              }
                            }

                            handleEditAutoSave();
                            exitEdit();
                          };

                          return (
                            <TableCell
                              key={cell.id}
                              id={cell.id}
                              data-cell-selected={isSelected}
                              onMouseDown={(e) => {
                                if (!!edit) return;
                                return cell.getSelectionStartHandler()(e);
                              }}
                              onMouseEnter={(e) => {
                                if (!!edit) return;
                                return cell.getSelectionExtendHandler()(e);
                              }}
                              onDoubleClick={() => {
                                if (!canEdit) return;
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

                                !!pinPosition && "sticky z-20",
                                pinPosition === "start" && "left-0 pl-4",
                                pinPosition === "end" && "right-0 pr-4",

                                canSelect &&
                                  "cell-selectable cursor-cell select-none",

                                isSelected &&
                                  !isCellEdited &&
                                  !isRowRemoved &&
                                  "bg-muted dark:bg-muted/50",

                                (isFocused || isEdit) && "cell-edge",

                                !isFocused && edges?.top && "cell-edge-top",
                                !isFocused && edges?.right && "cell-edge-right",
                                !isFocused &&
                                  edges?.bottom &&
                                  "cell-edge-bottom",
                                !isFocused && edges?.left && "cell-edge-left",

                                isEdit && "p-0",
                                isCellEdited &&
                                  !isEdit &&
                                  !isRowRemoved &&
                                  "bg-warning/32",

                                cellClassName,
                              )}
                              {...restCellProps}
                            >
                              {isEdit ? (
                                <CellEditorController
                                  defaultValue={cell.getValue()}
                                  columnMeta={columnMeta}
                                  editorMeta={editorMeta}
                                  onSubmit={onCellEditorSubmit}
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
              className="text-muted-foreground py-4 text-center whitespace-pre-line"
            >
              {placeholder ?? messages.empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      <TableFooter>
        {loading ? (
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

                          !!pinPosition && "sticky z-20",
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

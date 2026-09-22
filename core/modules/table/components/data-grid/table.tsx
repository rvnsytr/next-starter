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
import { toast } from "@/core/components/ui/toast";
import { TableRowSkeleton } from "@/core/modules/table/components/base/table-row-skeleton";
import { TABLE_CELL_CLASS } from "@/core/modules/table/constants";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import {
  DataGridCellEditContext,
  DataGridEditState,
  TableProps,
} from "@/core/modules/table/types";
import {
  getParentColumns,
  hasNestedKey,
  setNestedValue,
} from "@/core/modules/table/utils";
import { Override } from "@/core/types";
import { messages } from "@/shared/messages";
import { useHotkey, useHotkeys } from "@tanstack/react-hotkeys";
import {
  CellData,
  CellSelectionBounds,
  CellSelectionState,
  RowData,
} from "@tanstack/react-table";
import { cn } from "cn";
import { useCallback, useMemo, useRef, useState } from "react";
import { TableResizeCursor } from "../base/table-resize-cursor";
import { useDataGrid } from "./provider";
import { TableCellEditorController } from "./table-cell-editor";

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
  style,
  containerProps,
  ...props
}: Override<
  TableProps,
  { containerProps?: Omit<React.ComponentProps<"div">, "ref" | "tabIndex"> }
>) {
  const table = dataGrid.useTableContext();
  const tableRef = useRef<HTMLDivElement>(null);

  const dataGridContext = useDataGrid();
  const [currentEdit, setCurrentEdit] = useState<DataGridEditState | null>(
    null,
  );

  const isLoading = table.options.meta?.loading ?? false;
  const withResizeIndicator = table.options.columnResizeMode !== "onChange";

  const { columnLength, hasFooter } = useMemo(() => {
    const leafColumns = table.getAllLeafColumns();
    return {
      columnLength: leafColumns.length,
      hasFooter: leafColumns.some((column) => !!column.columnDef.footer),
    };
  }, [table]);

  const originalData = useMemo(() => {
    const meta = table.options.meta;
    return meta && "original" in meta ? (meta.original as RowData[]) : [];
  }, [table.options.meta]);

  const rowChanges = useMemo(
    () => dataGridContext.getChanges(),
    [dataGridContext],
  );

  const handleChanges = useCallback(() => {
    const currentChanges = dataGridContext.getChanges();
    table.options.meta?.onChange?.(currentChanges);
  }, [dataGridContext, table.options.meta]);

  const handleCellEdit = useCallback(
    (newValue: CellData, context: DataGridCellEditContext) => {
      const column = table.getColumn(context.columnId);
      if (!column) return;

      const { newRows, updateRow } = dataGridContext;
      const addedRows = newRows.form.getValues("rows");

      const { rowId, rowData, columnId, columnMeta } = context;

      const key = columnMeta?.editor?.key;
      let keys = key ? [...key.split(".")] : [];
      if (!keys.length) {
        keys = [
          ...getParentColumns(column).map(
            (c) => c.columnDef.meta?.editor?.key ?? c.id,
          ),
          columnId,
        ];
      }

      const isOriginalRow = originalData.some(
        (r, i) => table.options.getRowId?.(r, i) === rowId,
      );

      if (isOriginalRow) {
        const changes = { [keys.join(".")]: newValue };
        updateRow({ rowId, rowData, changes });
      } else {
        const addedRowIndex = addedRows.findIndex(
          (r, i) => table.options.getRowId?.(r, i) === rowId,
        );

        if (addedRowIndex >= 0) {
          const updated = setNestedValue(rowData, keys, newValue);
          newRows.fieldArray.update(addedRowIndex, updated);
        }
      }

      handleChanges();
    },
    [dataGridContext, handleChanges, originalData, table],
  );

  const exitCell = useCallback(() => {
    if (currentEdit) {
      setCurrentEdit(null);
      setTimeout(() => {
        tableRef.current?.focus({ preventScroll: true });
        table.setFocusedCell(currentEdit.rowId, currentEdit.columnId);
      }, 0);
    } else if (table.state.cellSelection.length > 0) {
      table.resetCellSelection(true);
    }
  }, [currentEdit, table]);

  useHotkey("Escape", () => exitCell());
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
        hotkey: "Tab",
        callback: () => table.moveCellSelection("right"),
        options: { conflictBehavior: "allow" },
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
        options: { enabled: !currentEdit },
      },
      {
        hotkey: "Mod+C",
        callback: () => {
          void navigator.clipboard.writeText(
            toTsv(table.getSelectedCellRangesData()),
          );
          toast.add({ type: "info", title: "Copied to clipboard" });
        },
        options: { enabled: !currentEdit },
      },
      {
        hotkey: "Enter",
        callback: () => {
          const cellSelectionState = table.state.cellSelection;
          if (!cellSelectionState.length) return;

          const css = cellSelectionState[0];
          const column = table.getColumn(css.anchorColumnId);

          const canEdit = !!column?.columnDef.meta?.editor;
          if (!canEdit) return;

          const rowId = css.anchorRowId;
          const columnId = css.anchorColumnId;
          const cellId = table.getFocusedCell()?.id;

          if (
            rowId === css.focusRowId &&
            columnId === css.focusColumnId &&
            cellId
          ) {
            setCurrentEdit({ rowId, columnId, cellId });
          }
        },
      },
      {
        hotkey: "Delete",
        callback: () => {
          const { newRows, removeRows } = dataGridContext;

          const rowIds = table.getCellSelectionRowIds();
          const addedRows = newRows.form.getValues("rows");

          const removedRows = rowIds
            .map((rowId) => ({ rowId, rowData: table.getRow(rowId).original }))
            .filter((row) => {
              const addedRowIndex = addedRows.findIndex(
                (r, i) => table.options.getRowId?.(r, i) === row.rowId,
              );

              const isAddedRow = addedRowIndex >= 0;
              if (isAddedRow) newRows.fieldArray.remove(addedRowIndex);

              return !isAddedRow;
            });

          removeRows(removedRows);

          const hasAddedRows = rowIds.length !== removedRows.length;
          if (hasAddedRows) handleChanges();
        },
      },
    ],
    { target: tableRef, enabled: !currentEdit },
  );

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
                const isAddedRow = originalData.every((r, i) => {
                  const rowId = table.options.getRowId?.(r, i);
                  return row.id !== rowId;
                });

                const isEditedRow = rowChanges.updated.some(
                  (r) => r.rowId === row.id,
                );

                const isRemovedRow = rowChanges.removed.some(
                  (r) => r.rowId === row.id,
                );

                return (
                  <TableRow
                    data-selected={row.getIsSelected()}
                    className={cn(
                      isAddedRow &&
                        "bg-success/32 hover:bg-success/32 not-in-data-[variant=card]:data-selected:bg-success/32",
                      isEditedRow && "bg-accent/50",
                      isRemovedRow &&
                        "bg-destructive/32 hover:bg-destructive/32 not-in-data-[variant=card]:data-selected:bg-destructive/32",
                    )}
                  >
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

                          const canSelect = cell.getCanSelect();

                          const isSelected = cell.getIsSelected();
                          const isFocused = cell.getIsFocused();

                          const edges = isSelected
                            ? cell.getSelectionEdges()
                            : null;

                          const isCellEdited = rowChanges.updated.some(
                            (r) =>
                              r.rowId === row.id &&
                              hasNestedKey(r.changes, cell.column.id),
                          );

                          return (
                            <TableCellEditorController
                              key={cell.id}
                              id={cell.id}
                              data-pinned={!!pinPosition}
                              context={{
                                rowId: row.id,
                                rowData: row.original,
                                columnId: cell.column.id,
                                cellId: cell.id,
                                cellData: cell.getValue(),
                                columnMeta,

                                currentEdit,
                                setCurrentEdit,
                                exitCell,
                                handleCellEdit,
                              }}
                              onMouseDown={cell.getSelectionStartHandler()}
                              onMouseEnter={cell.getSelectionExtendHandler()}
                              style={{
                                ...cellStyle,
                                width: cell.column.getSize(),
                                left: cell.column.getStart("start"),
                                right: cell.column.getAfter("end"),
                              }}
                              className={cn(
                                TABLE_CELL_CLASS.base,

                                !!pinPosition && TABLE_CELL_CLASS.pin,
                                pinPosition === "start" &&
                                  TABLE_CELL_CLASS.pinLeft,
                                pinPosition === "end" &&
                                  TABLE_CELL_CLASS.pinRight,

                                canSelect && "cell-selectable select-none",
                                isFocused && "cell-edge",

                                // (isFocused || isEdit) && "cell-edge",

                                !isFocused && edges?.top && "cell-edge-top",
                                !isFocused && edges?.right && "cell-edge-right",
                                !isFocused &&
                                  edges?.bottom &&
                                  "cell-edge-bottom",
                                !isFocused && edges?.left && "cell-edge-left",

                                isSelected &&
                                  !isAddedRow &&
                                  !isCellEdited &&
                                  !isRemovedRow &&
                                  "bg-muted dark:bg-muted/50",

                                cellClassName,

                                isCellEdited &&
                                  !isRemovedRow &&
                                  "bg-warning/32 dark:bg-warning/32",
                              )}
                              {...restCellProps}
                            >
                              <cell.FlexRender />
                            </TableCellEditorController>
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

import { ButtonGroup } from "@/core/components/ui/button-group";
import { Label } from "@/core/components/ui/label";
import { Separator } from "@/core/components/ui/separator";
import { useIsDesktop } from "@/core/hooks/use-media-query";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { TableLayoutProps } from "@/core/modules/table/types";
import { cn, formatNumber } from "@/core/utils";
import { useDataGrid } from "./provider";
import { ResetChangesButtonProps } from "./reset-changes-button";
import { SaveChangesButtonProps } from "./save-changes-button";

export function DataGridLayout({
  tableProps,
  activeFiltersProps,
  activeFiltersContainerProps,
  clearFiltersProps,
  columnSortMenuProps,
  columnVisibilityMenuProps,
  filterSelectorProps,
  pageSizeSelectorProps,
  paginationProps,
  resetTableButtonProps,
  searchProps,
  caption,
  className,
  classNames,
  renderSlot,
  saveChangesButtonProps,
  resetChangesButtonProps,
  ...props
}: TableLayoutProps & DataGridEditorToolbarProps) {
  const isDesktop = useIsDesktop();

  const table = dataGrid.useTableContext();

  const {
    align: clearFiltersAlign = "start",
    side: clearFiltersSide = "bottom",
    shortcut: clearFiltersShortcut = "default",
    ...restClearFiltersProps
  } = clearFiltersProps ?? {};

  const {
    align: filterSelectorAlign = "start",
    shortcut: filterSelectorShortcut = "default",
    ...restFilterSelectorProps
  } = filterSelectorProps ?? {};

  const {
    align: columnSortMenuAlign = "center",
    shortcut: columnSortMenuShortcut = "default",
    ...restColumnSortMenuProps
  } = columnSortMenuProps ?? {};

  const {
    align: columnVisibilityMenuAlign = isDesktop ? "center" : "end",
    shortcut: columnVisibilityMenuShortcut = "default",
    ...restColumnVisibilityMenuProps
  } = columnVisibilityMenuProps ?? {};

  const { id: pageSizeSelectorId = "page-size", ...restPageSizeSelectorProps } =
    pageSizeSelectorProps ?? {};

  const { className: paginationClassName, ...restPaginationProps } =
    paginationProps ?? {};

  const {
    shortcut: resetTableButtonShortcut = "default",
    ...restResetTableButtonProps
  } = resetTableButtonProps ?? {};

  const { shortcut: searchShortcut = "default", ...restSearchProps } =
    searchProps ?? {};

  const {
    align: saveChangesButtonAlign = isDesktop ? "center" : "start",
    shortcut: saveChangesButtonShortcut = "default",
    ...restSaveChangesButtonProps
  } = saveChangesButtonProps ?? {};

  const {
    align: resetChangesButtonAlign = isDesktop ? "center" : "end",
    shortcut: resetChangesButtonShortcut = "default",
    ...restResetChangesButtonProps
  } = resetChangesButtonProps ?? {};

  return (
    <table.Provider>
      <div
        className={cn("relative flex w-full flex-col gap-y-4", className)}
        {...props}
      >
        <div
          className={cn(
            "flex w-full flex-col gap-2 px-4 lg:flex-row lg:items-center lg:justify-between",
            "**:data-[slot=button-group]:w-full lg:**:data-[slot=button-group]:w-fit **:data-[slot=button-group]:**:[button]:grow",
            classNames?.header,
          )}
        >
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <ButtonGroup>
              <table.FilterSelector
                align={filterSelectorAlign}
                shortcut={filterSelectorShortcut}
                {...restFilterSelectorProps}
              />
              <table.ColumnSortMenu
                align={columnSortMenuAlign}
                shortcut={columnSortMenuShortcut}
                {...restColumnSortMenuProps}
              />
              <table.ColumnVisibilityMenu
                align={columnVisibilityMenuAlign}
                shortcut={columnVisibilityMenuShortcut}
                {...restColumnVisibilityMenuProps}
              />
            </ButtonGroup>

            <DataGridEditorToolbar
              saveChangesButtonProps={{
                align: saveChangesButtonAlign,
                shortcut: saveChangesButtonShortcut,
                ...restSaveChangesButtonProps,
              }}
              resetChangesButtonProps={{
                align: resetChangesButtonAlign,
                shortcut: resetChangesButtonShortcut,
                ...restResetChangesButtonProps,
              }}
            />

            {renderSlot}
          </div>

          <div className="flex gap-x-2 *:grow">
            <table.ResetTableButton
              shortcut={resetTableButtonShortcut}
              {...restResetTableButtonProps}
            />
            <table.Search shortcut={searchShortcut} {...restSearchProps} />
          </div>
        </div>

        <table.Subscribe selector={(s) => s.columnFilters.length}>
          {(columnFiltersLength) => {
            if (columnFiltersLength <= 0) return null;
            return (
              <table.ActiveFiltersContainer {...activeFiltersContainerProps}>
                <table.ClearFilters
                  align={clearFiltersAlign}
                  side={clearFiltersSide}
                  shortcut={clearFiltersShortcut}
                  {...restClearFiltersProps}
                />
                <table.ActiveFilters {...activeFiltersProps} />
              </table.ActiveFiltersContainer>
            );
          }}
        </table.Subscribe>

        <table.Table {...tableProps} />

        <div
          className={cn(
            "text-muted-foreground flex w-full flex-col items-center gap-4 px-4 text-center text-sm lg:flex-row",
            classNames?.footer,
          )}
        >
          <div className="order-4 flex items-center gap-x-2 *:shrink-0 lg:order-1">
            <Label htmlFor={pageSizeSelectorId} className="font-normal">
              Rows per page
            </Label>
            <table.PageSizeSelector
              id={pageSizeSelectorId}
              {...restPageSizeSelectorProps}
            />
          </div>

          <div className="**:data-[slot=separator]:text-border order-3 **:shrink-0 **:data-[slot=separator]:mx-2 lg:order-2">
            <table.Subscribe
              selector={(s) => Object.keys(s.rowSelection).length}
            >
              {(rowCount) => {
                const cellCount = table.getSelectedCellCount();

                if (rowCount <= 0 && cellCount <= 0) return null;

                return (
                  <>
                    {rowCount > 0 && (
                      <small>
                        <b>{formatNumber(rowCount)}</b> rows selected
                      </small>
                    )}

                    {rowCount > 0 && cellCount > 0 && (
                      <span data-slot="separator">|</span>
                    )}

                    {cellCount > 0 && (
                      <small>
                        <b>{formatNumber(cellCount)}</b> cells selected
                      </small>
                    )}
                  </>
                );
              }}
            </table.Subscribe>

            <ChangesCount />
          </div>

          {caption ? (
            <small
              data-slot="caption"
              className="text-muted-foreground order-1 mx-auto text-sm lg:order-3"
            >
              {caption}
            </small>
          ) : (
            isDesktop && <div className="order-3 mx-auto" />
          )}

          <table.Subscribe selector={(s) => s.pagination}>
            {({ pageIndex, pageSize }) => {
              const rowsCount = table.getRowCount();

              const startRowNumber = pageIndex * pageSize + 1;
              const rawEndRowNumber = startRowNumber + pageSize - 1;
              const endRowNumber = Math.min(rawEndRowNumber, rowsCount);

              return (
                <span className="order-2 shrink-0 tabular-nums lg:order-4">
                  <span className="text-foreground">
                    {tableProps?.loading
                      ? "?"
                      : `${formatNumber(startRowNumber)}-${formatNumber(endRowNumber)}`}
                  </span>
                  {tableProps?.loading ? "?" : ` of ${formatNumber(rowsCount)}`}
                </span>
              );
            }}
          </table.Subscribe>

          <table.Pagination
            className={cn("order-3 lg:order-5", paginationClassName)}
            {...restPaginationProps}
          />
        </div>
      </div>
    </table.Provider>
  );
}

type DataGridEditorToolbarProps = {
  saveChangesButtonProps?: SaveChangesButtonProps;
  resetChangesButtonProps?: ResetChangesButtonProps;
};

function DataGridEditorToolbar({
  saveChangesButtonProps,
  resetChangesButtonProps,
}: DataGridEditorToolbarProps) {
  const table = dataGrid.useTableContext();
  const dataGridContext = useDataGrid();

  if (!dataGridContext.count.updated && !dataGridContext.count.removed)
    return null;

  return (
    <>
      <Separator orientation="vertical" className="hidden h-4 lg:flex" />

      <ButtonGroup>
        <table.SaveChangesButton {...saveChangesButtonProps} />
        <table.ResetChangesButton {...resetChangesButtonProps} />
      </ButtonGroup>
    </>
  );
}

function ChangesCount() {
  const table = dataGrid.useTableContext();
  const dataGridContext = useDataGrid();

  const { updated, removed } = dataGridContext.count;

  if (updated <= 0 && removed <= 0) return null;

  return (
    <table.Subscribe selector={(s) => Object.keys(s.rowSelection).length}>
      {(rowCount) => {
        const cellCount = table.getSelectedCellCount();

        const isRowOrCellSelected = rowCount > 0 || cellCount > 0;

        return (
          <>
            {isRowOrCellSelected && <span data-slot="separator">|</span>}

            {updated > 0 && (
              <small className="text-warning/72">
                <b className="text-warning">{formatNumber(updated)}</b> rows
                updated
              </small>
            )}

            {updated > 0 && removed > 0 && <span data-slot="separator">|</span>}

            {removed > 0 && (
              <small className="text-destructive/72">
                <b className="text-destructive">{formatNumber(removed)}</b> rows
                removed
              </small>
            )}
          </>
        );
      }}
    </table.Subscribe>
  );
}

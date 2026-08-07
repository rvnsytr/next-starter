import { ButtonGroup } from "@/core/components/ui/button-group";
import { Label } from "@/core/components/ui/label";
import { useIsDesktop } from "@/core/hooks/use-media-query";
import { cn, formatNumber } from "@/core/utils";
import { dataTable } from "../hooks/data-table";
import { TableTemplateProps } from "../types";

export function DataTableTemplate({
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
  ...props
}: TableTemplateProps & {
  caption?: string;
  classNames?: {
    header?: string;
    footer?: string;
  };
}) {
  const isDesktop = useIsDesktop();

  const table = dataTable.useTableContext();

  const rowsCount = table.getRowCount();
  const selectedRowsCount = Object.keys(table.atoms.rowSelection.get()).length;

  const { pageIndex, pageSize } = table.atoms.pagination.get();
  const startRowNumber = pageIndex * pageSize + 1;
  const endRowNumber = Math.min(startRowNumber + pageSize - 1, rowsCount);

  const { align: clearFiltersAlign = "start", ...restClearFiltersProps } =
    clearFiltersProps ?? {};

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

  return (
    <div
      className={cn("relative flex w-full flex-col gap-y-4", className)}
      {...props}
    >
      <div
        className={cn(
          "flex w-full flex-col gap-2 px-4 lg:flex-row lg:justify-between",
          classNames?.header,
        )}
      >
        <ButtonGroup className="w-full lg:w-fit **:[button]:grow">
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

        <div className="flex gap-x-2 *:grow">
          <table.ResetTableButton
            shortcut={resetTableButtonShortcut}
            {...restResetTableButtonProps}
          />
          <table.Search shortcut={searchShortcut} {...restSearchProps} />
        </div>
      </div>

      {table.atoms.columnFilters.get().length > 0 && (
        <table.ActiveFiltersContainer {...activeFiltersContainerProps}>
          <table.ClearFilters
            align={clearFiltersAlign}
            {...restClearFiltersProps}
          />
          <table.ActiveFilters {...activeFiltersProps} />
        </table.ActiveFiltersContainer>
      )}

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

        {selectedRowsCount > 0 && (
          <small className="order-3 shrink-0 lg:order-2">
            {formatNumber(selectedRowsCount)} rows selected
          </small>
        )}

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

        <span className="order-2 shrink-0 tabular-nums lg:order-4">
          <span className="text-foreground">
            {formatNumber(startRowNumber)}-{formatNumber(endRowNumber)}
          </span>
          {` of ${formatNumber(rowsCount)}`}
        </span>

        <table.Pagination
          className={cn("order-3 lg:order-5", paginationClassName)}
          {...restPaginationProps}
        />
      </div>
    </div>
  );
}

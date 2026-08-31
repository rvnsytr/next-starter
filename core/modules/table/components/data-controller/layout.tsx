import { ButtonGroup } from "@/core/components/ui/button-group";
import { Label } from "@/core/components/ui/label";
import { useIsDesktop } from "@/core/hooks/use-media-query";
import { dataController } from "@/core/modules/table/hooks/data-controller";
import { TableLayoutProps } from "@/core/modules/table/types";
import { cn, formatNumber } from "@/core/utils";
import { useMemo } from "react";

export function DataControllerLayout({
  activeFiltersProps,
  activeFiltersContainerProps,
  clearFiltersProps,
  columnSortMenuProps,
  filterSelectorProps,
  pageSizeSelectorProps,
  paginationProps,
  resetTableButtonProps,
  searchProps,
  caption,
  className,
  classNames,
  renderSlot,
  children,
  ...props
}: TableLayoutProps) {
  const isDesktop = useIsDesktop();

  const table = dataController.useTableContext();

  const isLoading = useMemo(
    () => table.options.meta?.loading,
    [table.options.meta?.loading],
  );

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
          </ButtonGroup>

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

      {children}

      <div
        className={cn(
          "text-muted-foreground flex w-full flex-col items-center gap-4 px-4 text-center text-sm lg:flex-row lg:items-center",
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

        <table.Subscribe selector={(s) => Object.keys(s.rowSelection).length}>
          {(count) => {
            if (count <= 0) return null;
            return (
              <small className="order-2 shrink-0 lg:order-2">
                {formatNumber(count)} selected
              </small>
            );
          }}
        </table.Subscribe>

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
              <span className="order-3 shrink-0 tabular-nums lg:order-4">
                {isLoading ? (
                  "?"
                ) : (
                  <>
                    <span className="text-foreground">
                      {`${formatNumber(startRowNumber)}-${formatNumber(endRowNumber)}`}
                    </span>
                    {` of ${formatNumber(rowsCount)}`}
                  </>
                )}
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
  );
}

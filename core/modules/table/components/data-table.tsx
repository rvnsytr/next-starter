"use client";

import { DataTableType } from "../types";
import { BaseTable, BaseTableProps } from "./base/base-table";
import { ColumnFilters, ColumnFiltersProps } from "./base/column-filters";
import { ColumnSortMenu, ColumnSortMenuProps } from "./base/column-sort-menu";
import {
  ColumnVisibilityMenu,
  ColumnVisibilityMenuProps,
} from "./base/column-visibility-menu";
import {
  PageSizeSelector,
  PageSizeSelectorProps,
} from "./base/page-size-selector";
import { Pagination, PaginationProps } from "./base/pagination";
import { PinMenu, PinMenuProps } from "./base/pin-menu";
import {
  ResetTableButton,
  ResetTableButtonProps,
} from "./base/reset-table-button";
import { RowCheckbox, RowCheckboxProps } from "./base/row-checkbox";
import { RowNumber, RowNumberProps } from "./base/row-number";
import { Search, SearchProps } from "./base/search";
import {
  SelectAllCheckbox,
  SelectAllCheckboxProps,
} from "./base/select-all-checkbox";
import { SortButton, SortButtonProps } from "./base/sort-button";

const tableType: DataTableType = "data-table";

export function DataTable(props: BaseTableProps) {
  return <BaseTable tableType={tableType} {...props} />;
}

export function DataTableColumnFilters(props: ColumnFiltersProps) {
  return <ColumnFilters tableType={tableType} {...props} />;
}

export function DataTableColumnSortMenu(props: ColumnSortMenuProps) {
  return <ColumnSortMenu tableType={tableType} {...props} />;
}

export function DataTableColumnVisibilityMenu(
  props: ColumnVisibilityMenuProps,
) {
  return <ColumnVisibilityMenu tableType={tableType} {...props} />;
}

export function DataTablePageSizeSelector(props: PageSizeSelectorProps) {
  return <PageSizeSelector tableType={tableType} {...props} />;
}

export function DataTablePagination(props: PaginationProps) {
  return <Pagination tableType={tableType} {...props} />;
}

export function DataTablePinMenu(props: PinMenuProps) {
  return <PinMenu tableType={tableType} {...props} />;
}

export function DataTableResetTableButton(props: ResetTableButtonProps) {
  return <ResetTableButton tableType={tableType} {...props} />;
}

export function DataTableSearch(props: SearchProps) {
  return <Search tableType={tableType} {...props} />;
}

export function DataTableSelectAllCheckbox(props: SelectAllCheckboxProps) {
  return <SelectAllCheckbox tableType={tableType} {...props} />;
}

export function DataTableRowCheckbox(props: RowCheckboxProps) {
  return <RowCheckbox tableType={tableType} {...props} />;
}

export function DataTableRowNumber(props: RowNumberProps) {
  return <RowNumber tableType={tableType} {...props} />;
}

export function DataTableSortButton(props: SortButtonProps) {
  return <SortButton tableType={tableType} {...props} />;
}

import { DataTableType } from "../types";
import { BaseTable, BaseTableProps } from "./base/base-table";
import { ColumnSortMenu, ColumnSortMenuProps } from "./base/column-sort-menu";
import {
  ColumnVisibilityMenu,
  ColumnVisibilityMenuProps,
} from "./base/column-visibility-menu";
import {
  ActiveFilters,
  ActiveFiltersProps,
  ClearFilters,
  ClearFiltersProps,
  FilterSelector,
  FilterSelectorProps,
} from "./base/filters";
import { Header, HeaderProps } from "./base/header";
import {
  PageSizeSelector,
  PageSizeSelectorProps,
} from "./base/page-size-selector";
import { Pagination, PaginationProps } from "./base/pagination";
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

const tableType: DataTableType = "data-table";

// --- Table Components

export function DataTable(props: BaseTableProps) {
  return <BaseTable {...props} />;
}

export function DataTableActiveFilters(props: ActiveFiltersProps) {
  return <ActiveFilters tableType={tableType} {...props} />;
}

export function DataTableClearFilters(props: ClearFiltersProps) {
  return <ClearFilters tableType={tableType} {...props} />;
}

export function DataTableColumnSortMenu(props: ColumnSortMenuProps) {
  return <ColumnSortMenu tableType={tableType} {...props} />;
}

export function DataTableColumnVisibilityMenu(
  props: ColumnVisibilityMenuProps,
) {
  return <ColumnVisibilityMenu tableType={tableType} {...props} />;
}

export function DataTableFilterSelector(props: FilterSelectorProps) {
  return <FilterSelector tableType={tableType} {...props} />;
}

export function DataTablePageSizeSelector(props: PageSizeSelectorProps) {
  return <PageSizeSelector tableType={tableType} {...props} />;
}

export function DataTablePagination(props: PaginationProps) {
  return <Pagination tableType={tableType} {...props} />;
}

export function DataTableResetTableButton(props: ResetTableButtonProps) {
  return <ResetTableButton tableType={tableType} {...props} />;
}

export function DataTableSearch(props: SearchProps) {
  return <Search tableType={tableType} {...props} />;
}

// --- Header Components

export function DataTableHeader(props: HeaderProps) {
  return <Header tableType={tableType} {...props} />;
}

export function DataTableSelectAllCheckbox(props: SelectAllCheckboxProps) {
  return <SelectAllCheckbox tableType={tableType} {...props} />;
}

// --- Cell Components

export function DataTableRowCheckbox(props: RowCheckboxProps) {
  return <RowCheckbox tableType={tableType} {...props} />;
}

export function DataTableRowNumber(props: RowNumberProps) {
  return <RowNumber tableType={tableType} {...props} />;
}

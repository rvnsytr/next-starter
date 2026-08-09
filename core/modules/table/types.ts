/* eslint-disable @typescript-eslint/no-explicit-any */

import { LucideIcon } from "lucide-react";
import { BaseTableProps } from "./components/base/base-table";
import { ColumnSortMenuProps } from "./components/base/column-sort-menu";
import { ColumnVisibilityMenuProps } from "./components/base/column-visibility-menu";
import {
  ActiveFiltersContainerProps,
  ActiveFiltersProps,
  ClearFiltersProps,
  FilterSelectorProps,
} from "./components/base/filters";
import { PageSizeSelectorProps } from "./components/base/page-size-selector";
import { PaginationProps } from "./components/base/pagination";
import { ResetTableButtonProps } from "./components/base/reset-table-button";
import { SearchProps } from "./components/base/search";
import { dataTableFeatures } from "./features/data-table";

export type TableComponents = {
  Table: React.ComponentType<any>;
  ActiveFilters: React.ComponentType<any>;
  ActiveFiltersContainer: React.ComponentType<any>;
  ClearFilters: React.ComponentType<any>;
  ColumnSortMenu: React.ComponentType<any>;
  ColumnVisibilityMenu: React.ComponentType<any>;
  FilterSelector: React.ComponentType<any>;
  PageSizeSelector: React.ComponentType<any>;
  Pagination: React.ComponentType<any>;
  ResetTableButton: React.ComponentType<any>;
  Search: React.ComponentType<any>;
};

export type HeaderComponents = {
  Header: React.ComponentType<any>;
  SelectAllCheckbox: React.ComponentType<any>;
};

export type CellComponents = {
  RowCheckbox: React.ComponentType<any>;
  RowNumber: React.ComponentType<any>;
};

export type TableTemplateProps = React.ComponentProps<"div"> & {
  tableProps?: BaseTableProps;
  activeFiltersProps?: ActiveFiltersProps;
  activeFiltersContainerProps?: ActiveFiltersContainerProps;
  clearFiltersProps?: ClearFiltersProps;
  columnSortMenuProps?: ColumnSortMenuProps;
  columnVisibilityMenuProps?: ColumnVisibilityMenuProps;
  filterSelectorProps?: FilterSelectorProps;
  pageSizeSelectorProps?: PageSizeSelectorProps;
  paginationProps?: PaginationProps;
  resetTableButtonProps?: ResetTableButtonProps;
  searchProps?: SearchProps;
};

export type ColumnMeta = {
  label?: string;
  icon?: LucideIcon;
  count?: number;
  max?: number;

  headerProps?: React.ComponentProps<"th">;
  cellProps?: React.ComponentProps<"td">;
  // footerProps?: React.ComponentProps<"th">;
};

export type TableType = DataTableType;

export type DataTableType = "data-table" | "data-table-server";
export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableTableTemplate = {
  Template: React.ComponentType<any>;
};

// export type DataGridType = "data-grid" | "data-grid-server";

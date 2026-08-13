/* eslint-disable @typescript-eslint/no-explicit-any */

import { Table } from "@/core/components/ui/table";
import { LucideIcon } from "lucide-react";
import { ClearFiltersProps } from "./components/base/clear-filters";
import { ColumnSortMenuProps } from "./components/base/column-sort-menu";
import { ColumnVisibilityMenuProps } from "./components/base/column-visibility-menu";
import {
  ActiveFiltersContainerProps,
  ActiveFiltersProps,
  FilterSelectorProps,
} from "./components/base/filters";
import { PageSizeSelectorProps } from "./components/base/page-size-selector";
import { PaginationProps } from "./components/base/pagination";
import { ResetTableButtonProps } from "./components/base/reset-table-button";
import { SearchProps } from "./components/base/search";

export type ColumnMeta = {
  /** The label displayed in the column header */
  label?: string;

  /** The icon displayed alongside the column header label */
  icon?: LucideIcon;

  /** The maximum value allowed for number-based filters */
  max?: number;

  /** Props applied to the column's header cell (`<th>`) */
  headerProps?: Omit<React.ComponentProps<"th">, "rowSpan" | "colSpan">;

  /** Props applied to the column's data cell (`<td>`) */
  cellProps?: Omit<React.ComponentProps<"td">, "rowSpan" | "colSpan">;

  /** Props applied to the column's footer cell (`<th>`) */
  // footerProps?: React.ComponentProps<"th">;
};

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
  ColumnHeader: React.ComponentType<any>;
  SelectAllCheckbox: React.ComponentType<any>;
};

export type CellComponents = {
  RowCheckbox: React.ComponentType<any>;
  RowNumber: React.ComponentType<any>;
};

export type BaseTableProps = React.ComponentProps<typeof Table> & {
  /** The caption for the table. */
  caption?: string;

  /** The placeholder message to display when the table has no data. */
  placeholder?: string;

  /** Whether the table is in a loading state. */
  loading?: boolean;
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

export type DataTableLayouts = {
  Layout: React.ComponentType<any>;
};

export type DataTableTableMeta = {};
export type DataTableColumnMeta = ColumnMeta;

export type DataGridLayouts = {
  Layout: React.ComponentType<any>;
};

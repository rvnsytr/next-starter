/* eslint-disable @typescript-eslint/no-explicit-any */

import { Table } from "@/core/components/ui/table";
import { ClearFiltersProps } from "../components/base/clear-filters";
import { ColumnSortMenuProps } from "../components/base/column-sort-menu";
import { ColumnVisibilityMenuProps } from "../components/base/column-visibility-menu";
import {
  ActiveFiltersContainerProps,
  ActiveFiltersProps,
  FilterSelectorProps,
} from "../components/base/filters";
import { PageSizeSelectorProps } from "../components/base/page-size-selector";
import { PaginationProps } from "../components/base/pagination";
import { ResetTableButtonProps } from "../components/base/reset-table-button";
import { SearchProps } from "../components/base/search";

export type TableProps = React.ComponentProps<typeof Table> & {
  /** The caption for the table. */
  caption?: string;

  /** The placeholder message to display when the table has no data. */
  placeholder?: string;

  /** Whether the table is in a loading state. */
  loading?: boolean;
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

export type TableHeaderComponents = {
  ColumnHeader: React.ComponentType<any>;
  SelectAllCheckbox: React.ComponentType<any>;
};

export type TableCellComponents = {
  RowNumber: React.ComponentType<any>;
  SelectRowCheckbox: React.ComponentType<any>;
};

export type TableLayoutProps = React.ComponentProps<"div"> & {
  tableProps?: TableProps;
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

  caption?: string;
  classNames?: {
    header?: string;
    footer?: string;
  };
  renderSlot?: React.ReactNode;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

import { LucideIcon } from "lucide-react";

export type DataTableType = "data-table" | "data-table-server";
// export type TabulatorType = "tabulator" | "tabulator-server";

export type TableComponents = {
  ColumnFilters: React.ComponentType<any>;
  ColumnSortMenu: React.ComponentType<any>;
  ColumnVisibilityMenu: React.ComponentType<any>;
  PageSizeSelector: React.ComponentType<any>;
  Pagination: React.ComponentType<any>;
  Reset: React.ComponentType<any>;
  Search: React.ComponentType<any>;
  Table: React.ComponentType<any>;
};

export type HeaderComponents = {
  SelectAllCheckbox: React.ComponentType<any>;
  SortButton: React.ComponentType<any>;
  PinMenu: React.ComponentType<any>;
};

export type CellComponents = {
  RowCheckbox: React.ComponentType<any>;
  RowNumber: React.ComponentType<any>;
};

export type TableMeta = {
  label?: string;
  icon?: LucideIcon;
  count?: number;
};

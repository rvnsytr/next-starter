/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TableCellComponents,
  TableComponents,
  TableHeaderComponents,
} from "./components";
import { ColumnMeta, TableMeta } from "./meta";

export type DataTableTableComponents = TableComponents & {
  ColumnVisibilityMenu: React.ComponentType<any>;
};

export type DataTableHeaderComponents = TableHeaderComponents;
export type DataTableCellComponents = TableCellComponents;

export type DataTableTableMeta = TableMeta;
export type DataTableColumnMeta = ColumnMeta;

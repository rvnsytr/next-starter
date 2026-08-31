import { ColumnMeta, TableMeta } from "./meta";

export type DataTableTableComponents = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Layout: React.ComponentType<any>;
};

export type DataTableTableMeta = TableMeta;
export type DataTableColumnMeta = ColumnMeta;

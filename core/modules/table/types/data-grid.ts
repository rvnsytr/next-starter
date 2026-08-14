import { RowData } from "@tanstack/react-table";
import { ColumnMeta } from "./meta";

export type DataGridLayouts = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Layout: React.ComponentType<any>;
};

export type DataGridCellEditorType = "string";

export type DataGridEditorContext = {
  type: "string";
  key?: string;
};

export type DataGridColumnMeta = ColumnMeta & {
  editor?: {
    type: "string";
    key?: string;
  };
};

export type DataGridEditState = {
  rowId: string;
  columnId: string;
  cellId: string;
};

export type DataGridActionContext<TData extends RowData> = DataGridEditState & {
  data: { old: TData; new: TData }[];
};

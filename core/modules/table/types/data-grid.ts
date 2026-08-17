/* eslint-disable @typescript-eslint/no-explicit-any */

import { RowData, TableFeatures } from "@tanstack/react-table";
import { ColumnMeta } from "./meta";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    /**
     * **Global**
     *
     * **Data Grid Only**
     *
     * This option is only applicable to the **Data Grid** component and is ignored for other table types.
     *
     * Defines the mode in which changes are submitted to the `onSave` callback.
     *
     * - `onSave` - Changes are submitted when the user explicitly saves.
     * - `onChange` - Changes are submitted immediately after a cell is edited.
     *
     * @default "onSave"
     */
    saveMode?: "onSave" | "onChange";

    /**
     * **Global**
     *
     * **Data Grid Only**
     *
     * This option is only applicable to the **Data Grid** component and is ignored for other table types.
     *
     * Callback function that is called when the changes are committed from the data grid.
     * This is only called when `saveMode` is set to `"onSave"`.
     */
    onSave?: (context: DataGridChanges<TData>) => void;
  }
}

export type DataGridTableComponents = {
  Layout: React.ComponentType<any>;
  Provider: React.ComponentType<any>;
  SaveChangesButton: React.ComponentType<any>;
  ResetChangesButton: React.ComponentType<any>;
};

export type DataGridCellEditorType = "string";

export type DataGridCellEditorMeta = {
  type: DataGridCellEditorType;
  key?: string;
};

export type DataGridColumnMeta = ColumnMeta & {
  editor?: DataGridCellEditorMeta;
};

export type DataGridChanges<TData extends RowData> = {
  added: TData[];
  updated: DataGridUpdateChange<TData>[];
  removed: DataGridRemoveChange<TData>[];
};

export type DataGridUpdateChange<TData extends RowData> = {
  rowId: string;
  data: TData;
  changes: Partial<TData>;
};

export type DataGridRemoveChange<TData extends RowData> = {
  rowId: string;
  data: TData;
};

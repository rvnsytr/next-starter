/* eslint-disable @typescript-eslint/no-explicit-any */

import { RowData, TableFeatures } from "@tanstack/react-table";
import { z } from "zod";
import { ColumnMeta } from "./meta";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    /**
     * **Global**
     *
     * **Data Grid Only**
     *
     * Determines when Data Grid changes are submitted.
     *
     * - `onSave` - Accumulates changes until they are explicitly saved.
     * - `onChange` - Submits changes immediately after each cell edit is applied.
     *
     * @default "onSave"
     */
    saveMode?: "onSave" | "onChange";

    /**
     * **Global**
     *
     * **Data Grid Only**
     *
     * Callback invoked after a cell edit has been applied.
     */
    onCellEditApplied?: (context: DataGridChanges<TData>) => void;

    /**
     * **Global**
     *
     * **Data Grid Only**
     *
     * Callback invoked when accumulated Data Grid changes are submitted.
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

export type DataGridCellEditorType = DataGridCellEditorMeta["type"];

export type DataGridCellEditorMeta = {
  key?: string;
} & (
  | { type: "string"; schema?: z.ZodType<string, any> }
  | { type: "number"; schema?: z.ZodType<number, any> }
);

export type DataGridColumnMeta = ColumnMeta & {
  editor?: DataGridCellEditorMeta;
};

export type DataGridEditState = {
  rowId: string;
  columnId: string;
  cellId: string;
};

export type DataGridChanges<TData extends RowData> = {
  added: TData[];
  updated: DataGridUpdateChange<TData>[];
  removed: DataGridRemoveChange<TData>[];
};

export type DataGridUpdateChange<TData extends RowData> = {
  rowId: string;
  rowData: TData;
  changes: Partial<TData>;
};

export type DataGridRemoveChange<TData extends RowData> = {
  rowId: string;
  rowData: TData;
};

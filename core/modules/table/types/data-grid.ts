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
  /** Override the column id used when writing the value back to the row. */
  key?: string;
} & (
  | {
      /** Controls which input component is rendered and which Zod schema is expected. */
      type: "string";
      /** Optional Zod schema used to validate the value before committing. */
      schema?: z.ZodType<string, any>;
    }
  | {
      /** Controls which input component is rendered and which Zod schema is expected. */
      type: "number";
      /** Optional Zod schema used to validate the value before committing. */
      schema?: z.ZodType<number, any>;
    }
);

export type DataGridColumnMeta = ColumnMeta & {
  /** Configuration for an inline cell editor. */
  editor?: DataGridCellEditorMeta;
};

export type DataGridEditState = {
  rowId: string;
  columnId: string;
  cellId: string;
};

export type DataGridChanges<TData extends RowData> = {
  /** Rows staged for insertion. */
  added: TData[];
  /** Rows with one or more field-level edits. */
  updated: DataGridUpdateChange<TData>[];
  /** Rows marked for deletion. */
  removed: DataGridRemoveChange<TData>[];
};

export type DataGridUpdateChange<TData extends RowData> = {
  rowId: string;
  rowData: TData;

  /**
   * Snapshot of all pending changes in the Data Grid.
   *
   * Only the fields that changed, keyed by column id (or `editor.key`).
   */
  changes: Partial<TData>;
};

export type DataGridRemoveChange<TData extends RowData> = {
  rowId: string;
  rowData: TData;
};

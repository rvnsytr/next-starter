/* eslint-disable @typescript-eslint/no-explicit-any */

import { InputProps } from "@/core/components/ui/input";
import { Override } from "@/core/types";
import { RowData } from "@tanstack/react-table";
import { z } from "zod";
import { ColumnMeta } from "./meta";

export type DataGridTableComponents = {
  Layout: React.ComponentType<any>;
  Provider: React.ComponentType<any>;
  AddRowButton: React.ComponentType<any>;
  ClearChangesButton: React.ComponentType<any>;
  SaveChangesButton: React.ComponentType<any>;
};

export type DataGridTableMeta<TData extends RowData> = {
  /** Default values used when adding a new row. */
  defaultValues: TData;

  /**
   * Determines when Data Grid changes are submitted.
   *
   * - `onSave` - Accumulates changes until they are explicitly saved.
   * - `onChange` - Submits changes immediately after each cell edit is applied.
   *
   * @default "onSave"
   */
  saveMode?: "onSave" | "onChange";

  /** Callback invoked when accumulated Data Grid changes are submitted. */
  onSave?: (context: DataGridChanges<TData>) => void;

  /** Callback invoked when the Data Grid data changes, either through row additions/removals or cell edits. */
  onChange?: (context: DataGridChanges<TData>) => void;
};

export type DataGridCellEditorType = DataGridCellEditorMeta["type"];

type ExcludedInputProps =
  | "ref"
  | "name"
  | "value"
  | "disabled"
  | "onChange"
  | "onBlur"
  | "unstyled"
  | "autoFocus";

export type CellEditorMetaBase = {
  /** Override the column id used when writing the value back to the row. */
  key?: string;

  /** Controls which input component is rendered and which Zod schema is expected. */
  type: "string";

  /** Optional Zod schema used to validate the value before committing. */
  schema?: z.ZodType<string, any>;

  /** Props passed to the input component. */
  props?: Omit<InputProps, ExcludedInputProps>;
};

export type DataGridCellEditorMeta =
  | CellEditorMetaBase
  | Override<
      CellEditorMetaBase,
      {
        type: "number";
        defaultValue?: number;
        schema?: z.ZodType<number, any>;
      }
    >;

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

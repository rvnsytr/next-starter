/* eslint-disable @typescript-eslint/no-explicit-any */

import { Checkbox } from "@/core/components/ui/checkbox";
import { InputProps } from "@/core/components/ui/input";
import { Switch } from "@/core/components/ui/switch";
import { Textarea } from "@/core/components/ui/textarea";
import { DeepPartial, Override } from "@/core/types";
import { RowData } from "@tanstack/react-table";
import { z } from "zod";
import { DataTableTableComponents } from "./data-table";
import { ColumnMeta, TableMeta } from "./meta";

export type DataGridTableComponents = DataTableTableComponents & {
  Provider: React.ComponentType<any>;
  AddRowButton: React.ComponentType<any>;
  ClearChangesButton: React.ComponentType<any>;
  SaveChangesButton: React.ComponentType<any>;
};

export type DataGridTableMeta<TData extends RowData> = TableMeta & {
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

  /**
   * Callback invoked when accumulated Data Grid changes are submitted.
   *
   * Return `true` to confirm and apply the changes, or `false` to reject them.
   */
  onSave?: (context: DataGridChanges<TData>) => boolean;

  /** Callback invoked when the Data Grid data changes, either through row additions/removals or cell edits. */
  onChange?: (context: DataGridChanges<TData>) => void;
};

export type DataGridCellEditorType = DataGridCellEditorMeta["type"];

type ExcludedCellEditorProps =
  | "ref"
  | "name"
  | "value"
  | "disabled"
  | "onChange"
  | "onBlur"
  | "unstyled"
  | "checked"
  | "onCheckedChange";

export type CellEditorMetaBase = {
  /**
   * Override the column id used when writing the value back to the row.
   *
   * Nested properties are represented using dot notation (e.g., "address.street").
   */
  key?: string;

  /** Controls which input component is rendered and which Zod schema is expected. */
  type: "string";

  /** Optional Zod schema used to validate the value before committing. */
  schema?: z.ZodType<string, any>;

  /** Props passed to the input component. */
  props?: Omit<InputProps, ExcludedCellEditorProps>;
};

export type DataGridCellEditorMeta =
  | CellEditorMetaBase
  | Override<
      CellEditorMetaBase,
      {
        type: "string:textarea";
        props?: Omit<
          React.ComponentProps<typeof Textarea>,
          ExcludedCellEditorProps
        >;
      }
    >
  | Override<
      CellEditorMetaBase,
      {
        type: "number";
        schema?: z.ZodType<number, any>;
      }
    >
  | Override<
      CellEditorMetaBase,
      {
        type: "boolean";
        schema?: z.ZodType<boolean, any>;
        props?: Omit<
          React.ComponentProps<typeof Checkbox>,
          ExcludedCellEditorProps
        >;
      }
    >
  | Override<
      CellEditorMetaBase,
      {
        type: "boolean:switch";
        schema?: z.ZodType<boolean, any>;
        props?: Omit<
          React.ComponentProps<typeof Switch>,
          ExcludedCellEditorProps
        >;
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
  changes: DeepPartial<TData>;
};

export type DataGridRemoveChange<TData extends RowData> = {
  rowId: string;
  rowData: TData;
};

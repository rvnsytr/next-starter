/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Autocomplete,
  AutocompleteInput,
  AutocompletePopup,
} from "@/core/components/ui/autocomplete";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Combobox,
  ComboboxChipsInput,
  ComboboxInput,
  ComboboxPopup,
} from "@/core/components/ui/combobox";
import { InputProps } from "@/core/components/ui/input";
import { Switch } from "@/core/components/ui/switch";
import { Textarea } from "@/core/components/ui/textarea";
import { DeepPartial, Override } from "@/core/types";
import { CellData, RowData } from "@tanstack/react-table";
import { SWRConfiguration } from "swr";
import { z } from "zod";
import { DataTableTableComponents } from "./data-table";
import { ColumnMeta, TableMeta } from "./meta";

export type DataGridTableComponents = DataTableTableComponents & {
  Provider: React.ComponentType<any>;
  AddRowButton: React.ComponentType<any>;
  ClearChangesButton: React.ComponentType<any>;
  SaveChangesButton: React.ComponentType<any>;
};

export type DataGridHeaderComponents = TableHeaderComponents;

export type DataGridCellComponents = TableCellComponents & {};

export type DataGridTableMeta<TData extends RowData> = TableMeta & {
  /** Default values used when adding a new row. */
  getDefaultValues: () => TData;

  /**
   * Callback invoked when accumulated Data Grid changes are submitted.
   *
   * Return `true` to confirm and apply the changes, or `false` to reject them.
   */
  onSave?: (context: {
    /** The accumulated changes for the current Data Grid edit session. */
    changes: DataGridChanges<TData>;

    /** Clears the current edit session, discarding any accumulated changes. */
    clearEdit: () => void;
  }) => Promise<boolean> | boolean;

  /** Callback invoked when the Data Grid data changes, either through row additions/removals or cell edits. */
  onEditChange?: (changes: DataGridChanges<TData>, silent?: boolean) => void;

  /**
   * Determines whether cell editing is enabled for the current row.
   *
   * When omitted, cell editing is enabled for all rows.
   */
  enableCellEditForRow?: boolean | ((rowData: TData) => boolean);

  /**
   * Determines whether row removal is enabled for the current row.
   *
   * When omitted, row removal is enabled for all rows.
   */
  enableCellRemoveForRow?: boolean | ((rowData: TData) => boolean);
};

export type DataGridColumnMeta = ColumnMeta & {
  /** Configuration for an inline cell editor. */
  editor?: DataGridCellEditorMeta;
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
  | "onCheckedChange"
  | "onValueChange";

type CellEditorComboboxProps<TMultiple extends boolean> = Omit<
  React.ComponentProps<typeof Combobox<string, TMultiple>>,
  | ExcludedCellEditorProps
  | "items"
  | "inputValue"
  | "onInputValueChange"
  | "multiple"
>;

export type CellEditorScope = "insert-only" | "update-only" | "both";

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

  /**
   * Determines the scope in which the cell editor is active.
   *
   * - `"insert-only"`: The editor is only active when inserting new rows.
   * - `"update-only"`: The editor is only active when updating existing rows.
   * - `"both"`: The editor is active for both inserting and updating rows.
   *
   * @default "both"
   */
  scope?: CellEditorScope;

  /** Props passed to the input component. */
  inputProps?: Override<
    Omit<InputProps, ExcludedCellEditorProps>,
    { type: "text" | "password" | "email" | "color" | "search" | "url" }
  >;
};

export type DataGridCellEditorMeta =
  | CellEditorMetaBase
  | Override<
      CellEditorMetaBase,
      {
        type: "string:textarea";
        schema?: z.ZodType<string, any>;
        props?: Omit<
          React.ComponentProps<typeof Textarea>,
          ExcludedCellEditorProps
        >;
      }
    >
  | Override<
      CellEditorMetaBase,
      {
        type: "string:autocomplete";
        schema?: z.ZodType<string, any>;
        onSearch: (value: string) => Promise<string[]> | string[];
        props?: Omit<
          React.ComponentProps<typeof Autocomplete>,
          ExcludedCellEditorProps
        >;
        inputProps?: Omit<
          React.ComponentProps<typeof AutocompleteInput>,
          ExcludedCellEditorProps
        >;
        popupProps?: Omit<
          React.ComponentProps<typeof AutocompletePopup>,
          ExcludedCellEditorProps
        >;
        queryConfig?: SWRConfiguration;
      }
    >
  | Override<
      CellEditorMetaBase,
      {
        type: "string:option";
        schema?: z.ZodType<string, any>;
        createable?: boolean;
        props?: CellEditorComboboxProps<false>;
        inputProps?: Omit<
          React.ComponentProps<typeof ComboboxInput>,
          ExcludedCellEditorProps | "inputGroupProps"
        >;
        popupProps?: Omit<
          React.ComponentProps<typeof ComboboxPopup>,
          ExcludedCellEditorProps
        >;
      }
    >
  | Override<
      CellEditorMetaBase,
      {
        type: "string:multi-option";
        schema?: z.ZodType<string[], any>;
        createable?: boolean;
        props?: CellEditorComboboxProps<true>;
        inputProps?: Omit<
          React.ComponentProps<typeof ComboboxChipsInput>,
          ExcludedCellEditorProps
        >;
        popupProps?: Omit<
          React.ComponentProps<typeof ComboboxPopup>,
          ExcludedCellEditorProps
        >;
      }
    >
  | Override<
      CellEditorMetaBase,
      {
        type: "number";
        schema?: z.ZodType<number, any>;
        inputProps?: Override<
          Omit<InputProps, ExcludedCellEditorProps>,
          { type: "number" | "tel" | "range" }
        >;
      }
    >
  | Override<
      CellEditorMetaBase,
      {
        type: "boolean:checkbox";
        schema?: z.ZodType<boolean, any>;
        alwaysEditable?: boolean;
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
        alwaysEditable?: boolean;
        props?: Omit<
          React.ComponentProps<typeof Switch>,
          ExcludedCellEditorProps
        >;
      }
    >
  | Override<
      CellEditorMetaBase,
      {
        type: "temporal";
        schema?: z.ZodType<Date, any>;
        inputProps?: Override<
          Omit<InputProps, ExcludedCellEditorProps>,
          { type: "datetime-local" | "date" | "time" }
        >;
      }
    >;
export type DataGridEditState = {
  rowId: string;
  columnId: string;
  cellId: string;
};

export type DataGridCellEditContext = DataGridEditState & {
  rowData: RowData;
  cellData: CellData;
  columnMeta?: DataGridColumnMeta;
};

export type DataGridCellEditOptions = {
  /**
   * Whether the edit should be applied silently without triggering change handlers.
   * @default `false`
   */
  silent?: boolean;
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

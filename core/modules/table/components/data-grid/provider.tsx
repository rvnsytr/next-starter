import {
  DataGridChanges,
  DataGridRemoveChange,
  DataGridUpdateChange,
} from "@/core/modules/table/types";
import { getNestedProperty, setNestedValue } from "@/core/modules/table/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { RowData } from "@tanstack/react-table";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

type CountChanges = { updated: number; removed: number };
type RowChanges = Pick<DataGridChanges<RowData>, "updated" | "removed">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AddRowsFormValues = { rows: any[] };
type AddRowsForm = UseFormReturn<AddRowsFormValues>;
type AddRowsFieldArray = UseFieldArrayReturn<AddRowsFormValues, "rows", "id">;

export type DataGridContextValue = {
  count: CountChanges;
  getChanges: () => DataGridChanges<RowData>;
  updateRow: (params: DataGridUpdateChange<RowData>) => void;
  removeRows: (params: DataGridRemoveChange<RowData>[]) => void;
  clearChanges: () => void;
  newRows: { form: AddRowsForm; fieldArray: AddRowsFieldArray };
};

export const DataGridContext = createContext<DataGridContextValue | undefined>(
  undefined,
);

export const DataGridProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [count, setCount] = useState<CountChanges>({
    updated: 0,
    removed: 0,
  });

  const rowChanges = useRef<RowChanges>({
    updated: [],
    removed: [],
  });

  const newRowsForm: AddRowsForm = useForm<AddRowsFormValues>({
    resolver: zodResolver(z.object({ rows: z.array(z.unknown()) })),
    defaultValues: { rows: [] },
  });

  const newRowsFieldArray: AddRowsFieldArray = useFieldArray({
    control: newRowsForm.control,
    name: "rows",
  });

  const getChanges = useCallback(() => {
    const removedRowIds = rowChanges.current.removed.map((r) => r.rowId);
    const filteredUpdated = rowChanges.current.updated.filter(
      (r) => !removedRowIds.includes(r.rowId),
    );

    return {
      ...rowChanges.current,
      added: newRowsForm.getValues("rows"),
      updated: filteredUpdated,
    };
  }, [newRowsForm]);

  const updateRow = useCallback((rows: DataGridUpdateChange<RowData>) => {
    const currentUpdatedRow = rowChanges.current.updated.find(
      (row) => row.rowId === rows.rowId,
    );

    const mergedChanges = {
      ...(currentUpdatedRow?.changes ?? {}),
      /** @note this is flat structure, nested properties are represented using dot notation (e.g., "address.street") */
      ...rows.changes,
    };

    const originalRowData = currentUpdatedRow?.rowData ?? rows.rowData;

    const effectiveChanges = Object.entries(mergedChanges).reduce(
      (acc, [k, v]) => {
        const keys = k.split(".");
        const originalData = getNestedProperty(originalRowData, keys);
        if (originalData !== v) acc = setNestedValue(acc, keys, v);
        return acc;
      },
      {} as Partial<RowData>,
    );

    const hasChanges = Object.keys(effectiveChanges).length > 0;

    if (currentUpdatedRow && hasChanges) {
      currentUpdatedRow.changes = effectiveChanges;
    } else if (currentUpdatedRow && !hasChanges) {
      rowChanges.current.updated = rowChanges.current.updated.filter(
        (row) => row.rowId !== rows.rowId,
      );
    } else if (hasChanges) {
      rowChanges.current.updated.push({
        rowId: rows.rowId,
        rowData: rows.rowData,
        changes: effectiveChanges,
      });
    }

    const updatedCount = rowChanges.current.updated.length;
    setCount((prev) => ({ ...prev, updated: updatedCount }));
  }, []);

  const removeRows = useCallback((rows: DataGridRemoveChange<RowData>[]) => {
    rows.forEach((row) => {
      const existingIndex = rowChanges.current.removed.findIndex(
        (r) => r.rowId === row.rowId,
      );

      if (existingIndex >= 0)
        rowChanges.current.removed.splice(existingIndex, 1);
      else rowChanges.current.removed.push(row);
    });

    const updatedCount = rowChanges.current.updated.length;
    const removedCount = rowChanges.current.removed.length;

    const removedUpdateRows = rowChanges.current.updated.filter((row) =>
      rowChanges.current.removed.some((r) => r.rowId === row.rowId),
    );

    const effectiveUpdated = updatedCount - removedUpdateRows.length;
    setCount({ updated: effectiveUpdated, removed: removedCount });
  }, []);

  const clearChanges = useCallback(() => {
    newRowsForm.reset();
    rowChanges.current = { updated: [], removed: [] };
    setCount({ updated: 0, removed: 0 });
  }, [newRowsForm]);

  return (
    <DataGridContext.Provider
      value={{
        count,
        getChanges,
        updateRow,
        removeRows,
        clearChanges,
        newRows: { form: newRowsForm, fieldArray: newRowsFieldArray },
      }}
    >
      {children}
    </DataGridContext.Provider>
  );
};

export function useDataGrid() {
  const ctx = useContext(DataGridContext);
  if (!ctx) throw new Error("useDataGrid must be used in DataGridProvider");
  return ctx;
}

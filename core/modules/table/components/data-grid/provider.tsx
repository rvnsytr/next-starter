import {
  DataGridChanges,
  DataGridRemoveChange,
  DataGridUpdateChange,
} from "@/core/modules/table/types";
import { RowData } from "@tanstack/react-table";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type CountChanges = { updated: number; removed: number };

type DataGridContextValue = {
  count: CountChanges;
  getChanges: () => DataGridChanges<RowData>;
  updateRow: (params: DataGridUpdateChange<RowData>) => void;
  removeRows: (params: DataGridRemoveChange<RowData>[]) => void;
  clearChanges: () => void;
};

export const DataGridContext = createContext<DataGridContextValue | undefined>(
  undefined,
);

export const DataGridProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [count, setCount] = useState<CountChanges>({ updated: 0, removed: 0 });

  const rowChanges = useRef<DataGridChanges<RowData>>({
    added: [],
    removed: [],
    updated: [],
  });

  const getChanges = useCallback(() => {
    const removedRowIds = rowChanges.current.removed.map((r) => r.rowId);
    const filteredUpdated = rowChanges.current.updated.filter(
      (r) => !removedRowIds.includes(r.rowId),
    );

    return {
      ...rowChanges.current,
      updated: filteredUpdated,
    };
  }, []);

  const updateRow = useCallback((params: DataGridUpdateChange<RowData>) => {
    const currentUpdatedRow = rowChanges.current.updated.find(
      (row) => row.rowId === params.rowId,
    );

    const mergedChanges = {
      ...(currentUpdatedRow?.changes ?? {}),
      ...params.changes,
    };

    const originalRowData = currentUpdatedRow?.rowData ?? params.rowData;

    const effectiveChanges = Object.entries(mergedChanges).reduce(
      (acc, [k, v]) => {
        if (originalRowData[k as keyof RowData] !== v)
          acc[k as keyof RowData] = v;
        return acc;
      },
      {} as Partial<RowData>,
    );

    const hasChanges = Object.keys(effectiveChanges).length > 0;

    if (currentUpdatedRow && hasChanges) {
      currentUpdatedRow.changes = effectiveChanges;
    } else if (currentUpdatedRow && !hasChanges) {
      rowChanges.current.updated = rowChanges.current.updated.filter(
        (row) => row.rowId !== params.rowId,
      );
    } else if (hasChanges) {
      rowChanges.current.updated.push({
        rowId: params.rowId,
        rowData: params.rowData,
        changes: effectiveChanges,
      });
    }

    const updatedCount = rowChanges.current.updated.length;
    setCount((prev) => ({ ...prev, updated: updatedCount }));
  }, []);

  const removeRows = useCallback((params: DataGridRemoveChange<RowData>[]) => {
    params.forEach((row) => {
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
    rowChanges.current = {
      added: [],
      removed: [],
      updated: [],
    };

    setCount({ updated: 0, removed: 0 });
  }, []);

  return (
    <DataGridContext.Provider
      value={{
        count,
        getChanges,
        updateRow,
        removeRows,
        clearChanges,
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

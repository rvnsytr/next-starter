import { DataGridChanges, DataGridRowChange } from "@/core/modules/table/types";
import { RowData } from "@tanstack/react-table";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type DataGridContextValue = {
  hasChanges: boolean;
  getChanges: () => DataGridChanges<RowData>;
  updateRow: (params: DataGridRowChange<RowData>) => void;
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
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const rowChanges = useRef<DataGridChanges<RowData>>({
    added: [],
    removed: [],
    updated: [],
  });

  const getChanges = useCallback(() => rowChanges.current, []);

  const updateRow = useCallback((params: DataGridRowChange<RowData>) => {
    const currentUpdatedRow = rowChanges.current.updated.find(
      (row) => row.rowId === params.rowId,
    );

    if (currentUpdatedRow) {
      currentUpdatedRow.changes = {
        ...currentUpdatedRow.changes,
        ...params.changes,
      };
    } else {
      rowChanges.current.updated.push({
        rowId: params.rowId,
        data: params.data,
        changes: params.changes,
      });
    }

    setHasChanges(true);
  }, []);

  const clearChanges = useCallback(() => {
    rowChanges.current = {
      added: [],
      removed: [],
      updated: [],
    };

    setHasChanges(false);
  }, []);

  return (
    <DataGridContext.Provider
      value={{
        hasChanges,
        getChanges,
        updateRow,
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

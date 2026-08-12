import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import {
  ResetTableButton,
  ResetTableButtonProps,
} from "../base/reset-table-button";

export function DataGridResetTableButton(props: ResetTableButtonProps) {
  const table = dataGrid.useTableContext();
  return (
    <ResetTableButton
      context={{
        onReset: () => {
          table.reset();
          table.setGlobalFilter("");
        },
      }}
      {...props}
    />
  );
}

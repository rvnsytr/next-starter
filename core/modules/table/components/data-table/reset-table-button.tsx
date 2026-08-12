import { dataTable } from "@/core/modules/table/hooks/data-table";
import {
  ResetTableButton,
  ResetTableButtonProps,
} from "../base/reset-table-button";

export function DataTableResetTableButton(props: ResetTableButtonProps) {
  const table = dataTable.useTableContext();
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

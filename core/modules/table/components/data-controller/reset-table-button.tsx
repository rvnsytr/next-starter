import { dataController } from "@/core/modules/table/hooks/data-controller";
import {
  ResetTableButton,
  ResetTableButtonProps,
} from "../base/reset-table-button";

export function DataControllerResetTableButton(props: ResetTableButtonProps) {
  const table = dataController.useTableContext();
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

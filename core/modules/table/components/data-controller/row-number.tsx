import { dataController } from "@/core/modules/table/hooks/data-controller";
import { calculateRowNumber } from "@/core/modules/table/utils";
import { formatNumber } from "@/core/utils";
import { RowNumber, RowNumberProps } from "../base/row-number";

export function DataControllerRowNumber(props: RowNumberProps) {
  const table = dataController.useTableContext();
  const cell = dataController.useCellContext();
  return (
    <table.Subscribe selector={(s) => s.pagination}>
      {(pagination) => {
        const rowNumber = calculateRowNumber(
          cell.row.index,
          pagination,
          table.options.manualPagination,
        );
        return <RowNumber {...props}>{formatNumber(rowNumber)}</RowNumber>;
      }}
    </table.Subscribe>
  );
}

import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { calculateRowNumber } from "@/core/modules/table/utils";
import { formatNumber } from "@/core/utils";
import { RowNumber, RowNumberProps } from "../base/row-number";

export function DataGridRowNumber(props: RowNumberProps) {
  const table = dataGrid.useTableContext();
  const cell = dataGrid.useCellContext();
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

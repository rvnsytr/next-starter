import { dataTable } from "@/core/modules/table/hooks/data-table";
import { calculateRowNumber } from "@/core/modules/table/utils";
import { formatNumber } from "@/core/utils";
import { RowNumber, RowNumberProps } from "../base/row-number";

export function DataTableRowNumber(props: RowNumberProps) {
  const table = dataTable.useTableContext();
  const cell = dataTable.useCellContext();
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

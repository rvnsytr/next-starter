"use client";

import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";

export function RowNumber({ tableType }: { tableType: DataTableType }) {
  const tableHook = getTableHook(tableType);
  const table = tableHook.useTableContext();
  const cell = tableHook.useCellContext();

  const { pageIndex, pageSize } = table.atoms.pagination.get();

  const rowNumber = cell.row.index + 1;
  const globalRowNumber = pageIndex * pageSize + rowNumber;

  return (
    <div className="text-center">
      {table.options.manualPagination ? globalRowNumber : rowNumber}
    </div>
  );
}

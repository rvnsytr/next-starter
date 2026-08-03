"use client";

import { dataTable } from "../hooks/data-table";

export function DataTableRowNumber() {
  const table = dataTable.useTableContext();
  const cell = dataTable.useCellContext();

  const { pageIndex, pageSize } = table.atoms.pagination.get();

  const rowNumber = cell.row.index + 1;
  const globalRowNumber = pageIndex * pageSize + rowNumber;

  return (
    <div className="text-center">
      {table.options.manualPagination ? globalRowNumber : rowNumber}
    </div>
  );
}

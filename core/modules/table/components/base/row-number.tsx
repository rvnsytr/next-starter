"use client";

import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import React from "react";

export type RowNumberProps = React.ComponentProps<"div">;

export function RowNumber({
  tableType,
  ...props
}: {
  tableType: DataTableType;
}) {
  const tableHook = getTableHook(tableType);
  const table = tableHook.useTableContext();
  const cell = tableHook.useCellContext();

  const { pageIndex, pageSize } = table.atoms.pagination.get();

  const rowNumber = cell.row.index + 1;
  const globalRowNumber = pageIndex * pageSize + rowNumber;

  return (
    <div {...props}>
      {table.options.manualPagination ? globalRowNumber : rowNumber}
    </div>
  );
}

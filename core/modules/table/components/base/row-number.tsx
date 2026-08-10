"use client";

import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import { cn, formatNumber } from "@/core/utils";

export type RowNumberProps = React.ComponentProps<"div">;

export function RowNumber({
  tableType,
  className,
  ...props
}: RowNumberProps & {
  tableType: DataTableType;
}) {
  const tableHook = getTableHook(tableType);

  const table = tableHook.useTableContext();
  const cell = tableHook.useCellContext();

  return (
    <table.Subscribe selector={(s) => s.pagination}>
      {({ pageIndex, pageSize }) => {
        const rowNumber = cell.row.index + 1;
        const globalRowNumber = pageIndex * pageSize + rowNumber;

        const num = table.options.manualPagination
          ? globalRowNumber
          : rowNumber;

        return (
          <div className={cn("tabular-nums", className)} {...props}>
            {formatNumber(num)}
          </div>
        );
      }}
    </table.Subscribe>
  );
}

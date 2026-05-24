"use client";

import { defaultPageSize, pageSizes } from "@/core/hooks/use-data-controller";
import { cn, formatNumber } from "@/core/utils";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function PageSize<TData>({
  table,
  initialSizeState,
  className,
  ...props
}: React.ComponentProps<typeof SelectTrigger> & {
  table: Table<TData>;
  initialSizeState?: number;
}) {
  const value =
    table.getState().pagination.pageSize ?? initialSizeState ?? defaultPageSize;

  return (
    <Select
      value={String(value)}
      onValueChange={(v) => table.setPageSize(Number(v))}
    >
      <SelectTrigger className={cn("min-w-fit", className)} {...props}>
        <SelectValue />
      </SelectTrigger>

      <SelectPopup>
        {pageSizes.map((v) => (
          <SelectItem
            key={v}
            value={String(v)}
            className={cn(v === defaultPageSize && "font-semibold")}
          >
            {formatNumber(v)}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

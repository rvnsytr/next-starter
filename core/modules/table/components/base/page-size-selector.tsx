"use client";

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/core/modules/table/constants";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import { cn, formatNumber } from "@/core/utils";

export type PageSizeSelectorProps = React.ComponentProps<typeof SelectTrigger>;

export function PageSizeSelector({
  tableType,
  className,
  ...props
}: PageSizeSelectorProps & { tableType: DataTableType }) {
  const table = getTableHook(tableType).useTableContext();

  return (
    <Select
      value={String(table.atoms.pagination.get().pageSize)}
      onValueChange={(v) => table.setPageSize(Number(v))}
    >
      <SelectTrigger className={cn("w-fit min-w-fit", className)} {...props}>
        <SelectValue />
      </SelectTrigger>

      <SelectPopup>
        {PAGE_SIZES.map((v) => (
          <SelectItem
            key={v}
            value={String(v)}
            className={cn(v === DEFAULT_PAGE_SIZE && "font-semibold")}
          >
            {formatNumber(v)}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

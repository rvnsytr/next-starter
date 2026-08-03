"use client";

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { cn, formatNumber } from "@/core/utils";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "../constants";
import { dataTable } from "../hooks/data-table";

export type PageSizeProps = React.ComponentProps<typeof SelectTrigger>;

export function PageSize({
  selectProps,
  className,
  ...props
}: PageSizeProps & { selectProps: React.ComponentProps<typeof Select> }) {
  return (
    <Select {...selectProps}>
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

export function DataTablePageSize(props: PageSizeProps) {
  const table = dataTable.useTableContext();
  return (
    <PageSize
      selectProps={{
        value: String(table.atoms.pagination.get().pageSize),
        onValueChange: (v) => table.setPageSize(Number(v)),
      }}
      {...props}
    />
  );
}

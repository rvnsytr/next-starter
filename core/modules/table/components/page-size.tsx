"use client";

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { cn, formatNumber } from "@/core/utils";
import { coreTable } from "../hooks/core-table";

export type PageSizeProps = React.ComponentProps<typeof SelectTrigger>;

export const pageSizes = [5, 10, 20, 30, 40, 50, 100];
export const defaultPageSize = pageSizes[1];

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

export function CoreTablePageSize(props: PageSizeProps) {
  const table = coreTable.useTableContext();
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

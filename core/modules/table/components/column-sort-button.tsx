"use client";

import { Button, ButtonProps } from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { SortDirection } from "@tanstack/react-table";
import { SORT_ICONS } from "../constants";
import { dataTable } from "../hooks/data-table";

export type ColumnSortButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export function ColumnSortButton({
  sortDirection,
  align = "center",
  size = "icon-xs",
  variant = "ghost",
  children,
  ...props
}: ColumnSortButtonProps & { sortDirection?: SortDirection | false }) {
  const isIconSize = size?.startsWith("icon");
  const SortIcon = sortDirection
    ? SORT_ICONS[sortDirection]
    : SORT_ICONS.default;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button size={size} variant={variant} {...props}>
            {children ?? (isIconSize && <SortIcon />)}
          </Button>
        }
      />

      <TooltipPopup align={align} className="capitalize">
        {typeof sortDirection === "string" ? sortDirection : "-"}
      </TooltipPopup>
    </Tooltip>
  );
}

export function DataTableColumnSortButton({
  onClick,
  ...props
}: ColumnSortButtonProps) {
  const header = dataTable.useHeaderContext();

  if (!header.column.getCanSort()) return null;

  const sortDirection = header.column.getIsSorted();

  return (
    <ColumnSortButton
      sortDirection={sortDirection}
      onClick={(e) => {
        if (!sortDirection) header.column.toggleSorting();
        else if (sortDirection === "asc") header.column.toggleSorting(true);
        else header.column.clearSorting();
        onClick?.(e);
      }}
      {...props}
    />
  );
}

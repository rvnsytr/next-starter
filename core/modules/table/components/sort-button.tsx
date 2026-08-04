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

export type SortButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export function SortButton({
  sortDirection,
  align = "center",
  size,
  variant = "ghost",
  children,
  ...props
}: SortButtonProps & { sortDirection?: SortDirection | false }) {
  const buttonSize: ButtonProps["size"] = size ?? (children ? "xs" : "icon-xs");
  const isIconSize = buttonSize?.startsWith("icon");

  const SortIcon = sortDirection
    ? SORT_ICONS[sortDirection]
    : SORT_ICONS.default;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button size={buttonSize} variant={variant} {...props}>
            {children ?? (isIconSize && <SortIcon />)}
          </Button>
        }
      />

      <TooltipPopup align={align} className="capitalize">
        {typeof sortDirection === "string" ? sortDirection : "Sort Column"}
      </TooltipPopup>
    </Tooltip>
  );
}

export function DataTableSortButton({ onClick, ...props }: SortButtonProps) {
  const header = dataTable.useHeaderContext();

  if (!header.column.getCanSort()) return null;

  const sortDirection = header.column.getIsSorted();

  return (
    <SortButton
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

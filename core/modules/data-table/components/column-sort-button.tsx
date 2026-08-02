"use client";

import {
  Button,
  ButtonIconSize,
  ButtonProps,
} from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { SortDirection } from "@tanstack/react-table";
import React from "react";
import { SORT_ICONS } from "../constants";
import { coreTable } from "../hooks/core-table";

export type ColumnSortButtonProps = ButtonProps & {
  size?: ButtonIconSize;
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export function ColumnSortButton({
  sortDirection,
  align,
  size = "icon-xs",
  variant = "ghost",
  ...props
}: ColumnSortButtonProps & { sortDirection?: SortDirection | false }) {
  const SortIcon = sortDirection
    ? SORT_ICONS[sortDirection]
    : SORT_ICONS.default;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button size={size} variant={variant} {...props}>
            <SortIcon />
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
  const header = coreTable.useHeaderContext();

  if (!header.column.getCanSort()) return null;

  const sortDirection = header.column.getIsSorted();

  return (
    <ColumnSortButton
      sortDirection={sortDirection}
      onClick={() => {
        if (!sortDirection) return header.column.toggleSorting();
        if (sortDirection === "asc") return header.column.toggleSorting(true);
        return header.column.clearSorting();
      }}
      {...props}
    />
  );
}

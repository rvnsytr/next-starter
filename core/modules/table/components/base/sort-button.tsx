"use client";

import { Button, ButtonProps } from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { SORT_ICONS } from "@/core/modules/table/constants";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";

export type SortButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export function SortButton({
  tableType,
  align = "center",
  size,
  variant = "ghost",
  onClick,
  children,
  ...props
}: SortButtonProps & { tableType: DataTableType }) {
  const header = getTableHook(tableType).useHeaderContext();

  if (!header.column.getCanSort()) return null;

  const buttonSize: ButtonProps["size"] = size ?? (children ? "xs" : "icon-xs");
  const isIconSize = buttonSize?.startsWith("icon");

  const sortDirection = header.column.getIsSorted();

  const SortIcon = sortDirection
    ? SORT_ICONS[sortDirection]
    : SORT_ICONS.default;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={buttonSize}
            variant={variant}

            onClick={(e) => {
              if (!sortDirection) header.column.toggleSorting();
              else if (sortDirection === "asc")
                header.column.toggleSorting(true);
              else header.column.clearSorting();
              onClick?.(e);
            }}
            {...props}
          >
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

"use client";

import { Button, ButtonProps } from "@/core/components/ui/button";
import { ButtonGroup } from "@/core/components/ui/button-group";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

export type PaginationProps = React.ComponentProps<typeof ButtonGroup> & {
  buttonsProps?: ButtonProps;
};

export function Pagination({
  tableType,
  buttonsProps = {},
  ...props
}: PaginationProps & { tableType: DataTableType }) {
  const table = getTableHook(tableType).useTableContext();

  const {
    size = "icon",
    variant = "outline",
    disabled = false,
    onClick,
    ...restButtonProps
  } = buttonsProps;

  return (
    <ButtonGroup {...props}>
      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          table.firstPage();
          onClick?.(e);
        }}
        disabled={disabled || !table.getCanPreviousPage()}
        {...restButtonProps}
      >
        <ChevronsLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          table.previousPage();
          onClick?.(e);
        }}
        disabled={disabled || !table.getCanPreviousPage()}
        {...restButtonProps}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          table.nextPage();
          onClick?.(e);
        }}
        disabled={disabled || !table.getCanNextPage()}
        {...restButtonProps}
      >
        <ChevronRightIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          table.lastPage();
          onClick?.(e);
        }}
        disabled={disabled || !table.getCanNextPage()}
        {...restButtonProps}
      >
        <ChevronsRightIcon />
      </Button>
    </ButtonGroup>
  );
}

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
  buttonsProps?: Pick<ButtonProps, "size" | "variant" | "disabled" | "onClick">;
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
      >
        <ChevronsRightIcon />
      </Button>
    </ButtonGroup>
  );
}

"use client";

import { Button, ButtonProps } from "@/core/components/ui/button";
import { ButtonGroup } from "@/core/components/ui/button-group";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { dataTable } from "../hooks/data-table";

export type PaginationProps = React.ComponentProps<typeof ButtonGroup> & {
  buttonsProps?: ButtonProps;
};

export function Pagination({
  firstButton,
  previousButton,
  nextButton,
  lastButton,
  buttonsProps = {},
  ...props
}: PaginationProps & {
  firstButton: Pick<ButtonProps, "onClick" | "disabled">;
  previousButton: Pick<ButtonProps, "onClick" | "disabled">;
  nextButton: Pick<ButtonProps, "onClick" | "disabled">;
  lastButton: Pick<ButtonProps, "onClick" | "disabled">;
}) {
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
          firstButton?.onClick?.(e);
          onClick?.(e);
        }}
        disabled={disabled || firstButton?.disabled}
        {...restButtonProps}
      >
        <ChevronsLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          previousButton?.onClick?.(e);
          onClick?.(e);
        }}
        disabled={disabled || previousButton?.disabled}
        {...restButtonProps}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          nextButton?.onClick?.(e);
          onClick?.(e);
        }}
        disabled={disabled || nextButton?.disabled}
        {...restButtonProps}
      >
        <ChevronRightIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          lastButton?.onClick?.(e);
          onClick?.(e);
        }}
        disabled={disabled || lastButton?.disabled}
        {...restButtonProps}
      >
        <ChevronsRightIcon />
      </Button>
    </ButtonGroup>
  );
}

export function DataTablePagination() {
  const table = dataTable.useTableContext();
  return (
    <Pagination
      firstButton={{
        onClick: () => table.firstPage(),
        disabled: !table.getCanPreviousPage(),
      }}
      previousButton={{
        onClick: () => table.previousPage(),
        disabled: !table.getCanPreviousPage(),
      }}
      nextButton={{
        onClick: () => table.nextPage(),
        disabled: !table.getCanNextPage(),
      }}
      lastButton={{
        onClick: () => table.lastPage(),
        disabled: !table.getCanNextPage(),
      }}
    />
  );
}

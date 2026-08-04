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
  firstButtonProps,
  previousButtonProps,
  nextButtonProps,
  lastButtonProps,
  buttonsProps = {},
  ...props
}: PaginationProps & {
  firstButtonProps: Pick<ButtonProps, "onClick" | "disabled">;
  previousButtonProps: Pick<ButtonProps, "onClick" | "disabled">;
  nextButtonProps: Pick<ButtonProps, "onClick" | "disabled">;
  lastButtonProps: Pick<ButtonProps, "onClick" | "disabled">;
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
          firstButtonProps?.onClick?.(e);
          onClick?.(e);
        }}
        disabled={disabled || firstButtonProps?.disabled}
        {...restButtonProps}
      >
        <ChevronsLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          previousButtonProps?.onClick?.(e);
          onClick?.(e);
        }}
        disabled={disabled || previousButtonProps?.disabled}
        {...restButtonProps}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          nextButtonProps?.onClick?.(e);
          onClick?.(e);
        }}
        disabled={disabled || nextButtonProps?.disabled}
        {...restButtonProps}
      >
        <ChevronRightIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          lastButtonProps?.onClick?.(e);
          onClick?.(e);
        }}
        disabled={disabled || lastButtonProps?.disabled}
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
      firstButtonProps={{
        onClick: () => table.firstPage(),
        disabled: !table.getCanPreviousPage(),
      }}
      previousButtonProps={{
        onClick: () => table.previousPage(),
        disabled: !table.getCanPreviousPage(),
      }}
      nextButtonProps={{
        onClick: () => table.nextPage(),
        disabled: !table.getCanNextPage(),
      }}
      lastButtonProps={{
        onClick: () => table.lastPage(),
        disabled: !table.getCanNextPage(),
      }}
    />
  );
}

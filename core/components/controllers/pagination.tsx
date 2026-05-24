"use client";

import { cn } from "@/core/utils";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button, ButtonProps } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";

export function Pagination<TData>({
  table,
  size = "icon",
  variant = "outline",
  className,
  disabled = false,
  ...props
}: Omit<ButtonProps, "onClick"> & { table: Table<TData> }) {
  return (
    <ButtonGroup className={cn(className)}>
      <Button
        size={size}
        variant={variant}
        onClick={() => table.firstPage()}
        disabled={disabled || !table.getCanPreviousPage()}
        {...props}
      >
        <ChevronsLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.previousPage()}
        disabled={disabled || !table.getCanPreviousPage()}
        {...props}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.nextPage()}
        disabled={disabled || !table.getCanNextPage()}
        {...props}
      >
        <ChevronRightIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.lastPage()}
        disabled={disabled || !table.getCanNextPage()}
        {...props}
      >
        <ChevronsRightIcon />
      </Button>
    </ButtonGroup>
  );
}

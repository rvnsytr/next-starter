"use client";

import { cn } from "@/utils";
import { CellContext, HeaderContext } from "@tanstack/react-table";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Pin,
  PinOff,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox, CheckboxProps } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ColumnHeader<TData, TValue>({
  column,
  className,
  children,
}: Pick<HeaderContext<TData, TValue>, "column"> & {
  className?: string;
  children: React.ReactNode;
}) {
  const columnPinned = column.getIsPinned();
  const ColumnPinIcon = columnPinned ? PinOff : Pin;

  return (
    <div
      className={cn(
        "flex items-center justify-start gap-x-2 font-medium",
        className,
      )}
    >
      {children}

      <div className="flex gap-x-px">
        {column.getCanSort() && (
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        )}

        {column.getCanPin() && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-xs" variant="ghost">
                <ColumnPinIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-fit flex-row">
              <DropdownMenuItem
                className="size-6"
                onClick={() => column.pin("left")}
                disabled={columnPinned === "left"}
              >
                <ArrowLeft />
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="size-6"
                onClick={() => column.pin(false)}
                disabled={columnPinned === false}
              >
                <X />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="size-6"
                onClick={() => column.pin("right")}
                disabled={columnPinned === "right"}
              >
                <ArrowRight />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export function ColumnHeaderCheckbox<TData, TValue>({
  table,
  ...props
}: Pick<HeaderContext<TData, TValue>, "table"> &
  Omit<CheckboxProps, "checked" | "onCheckedChange">) {
  return (
    <Checkbox
      aria-label="Select all"
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      {...props}
    />
  );
}

export function ColumnCellCheckbox<TData, TValue>({
  row,
  ...props
}: Pick<CellContext<TData, TValue>, "row"> &
  Omit<CheckboxProps, "checked" | "onCheckedChange">) {
  return (
    <Checkbox
      aria-label="Select row"
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      {...props}
    />
  );
}

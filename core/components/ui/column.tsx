import { cn } from "@/core/utils";
import { CellContext, HeaderContext } from "@tanstack/react-table";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpDownIcon,
  PinIcon,
  PinOffIcon,
  XIcon,
} from "lucide-react";
import { Button } from "./button";
import { Checkbox, CheckboxProps } from "./checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function ColumnHeader<TData, TValue>({
  column,
  className,
  children,
}: Pick<HeaderContext<TData, TValue>, "column"> & {
  className?: string;
  children: React.ReactNode;
}) {
  const columnPinned = column.getIsPinned();
  const ColumnPinIcon = columnPinned ? PinOffIcon : PinIcon;

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
            <ArrowUpDownIcon />
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
                <ArrowLeftIcon />
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="size-6"
                onClick={() => column.pin(false)}
                disabled={columnPinned === false}
              >
                <XIcon />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="size-6"
                onClick={() => column.pin("right")}
                disabled={columnPinned === "right"}
              >
                <ArrowRightIcon />
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
  className,
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
      className={cn("mx-auto", className)}
      {...props}
    />
  );
}

export function ColumnCellCheckbox<TData, TValue>({
  row,
  className,
  ...props
}: Pick<CellContext<TData, TValue>, "row"> &
  Omit<CheckboxProps, "checked" | "onCheckedChange">) {
  if (!row.getCanSelect()) return;
  return (
    <Checkbox
      aria-label="Select row"
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      className={cn("mx-auto", className)}
      {...props}
    />
  );
}

export function ColumnCellNumber<TData, TValue>({
  table,
  row,
}: Pick<CellContext<TData, TValue>, "table" | "row">) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const rowNumber = pageIndex * pageSize + row.index + 1;
  return <div className="text-center">{rowNumber}</div>;
}

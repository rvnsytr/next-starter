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
import { SORT_ICONS } from "../data-controller";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Popover, PopoverPopup, PopoverTrigger } from "./popover";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./tooltip";

export function ColumnHeader<TData, TValue>({
  column,
  isMulti = true,
  className,
  disabled = false,
  children,
}: Pick<HeaderContext<TData, TValue>, "column"> & {
  isMulti?: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const columnPinned = column.getIsPinned();
  const ColumnPinIcon = columnPinned ? PinOffIcon : PinIcon;

  const sort = column.getIsSorted();
  const SortIcon = sort ? SORT_ICONS[sort] : ArrowUpDownIcon;

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
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => {
                    if (sort === "asc") column.toggleSorting(true, isMulti);
                    else if (sort === "desc") column.clearSorting();
                    else column.toggleSorting(false, isMulti);
                  }}
                  disabled={disabled}
                >
                  <SortIcon />
                </Button>
              }
            />
            <TooltipPopup className="capitalize">
              {typeof sort === "string" ? sort : "-"}
            </TooltipPopup>
          </Tooltip>
        )}

        {column.getCanPin() && (
          <Popover>
            <PopoverTrigger
              openOnHover
              delay={0}
              render={
                <Button size="icon-xs" variant="ghost" disabled={disabled}>
                  <ColumnPinIcon />
                </Button>
              }
            />

            <PopoverPopup className="*:p-1">
              <Button
                size="xs"
                variant="ghost"
                onClick={() => column.pin("left")}
                disabled={columnPinned === "left"}
              >
                <ArrowLeftIcon />
              </Button>
              <Button
                size="xs"
                variant="destructive-ghost"
                onClick={() => column.pin(false)}
                disabled={columnPinned === false}
              >
                <XIcon />
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => column.pin("right")}
                disabled={columnPinned === "right"}
              >
                <ArrowRightIcon />
              </Button>
            </PopoverPopup>
          </Popover>
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
  Omit<React.ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange">) {
  return (
    <Checkbox
      aria-label="Select all"
      indeterminate={table.getIsSomePageRowsSelected()}
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
  Omit<React.ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange">) {
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

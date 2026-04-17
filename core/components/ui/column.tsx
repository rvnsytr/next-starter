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
import { Checkbox } from "./checkbox";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "./menu";

export function ColumnHeader<TData, TValue>({
  column,
  className,
  disabled = false,
  children,
}: Pick<HeaderContext<TData, TValue>, "column"> & {
  className?: string;
  disabled?: boolean;
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
            disabled={disabled}
          >
            <ArrowUpDownIcon />
          </Button>
        )}

        {column.getCanPin() && (
          <Menu>
            <MenuTrigger
              render={
                <Button size="icon-xs" variant="ghost" disabled={disabled}>
                  <ColumnPinIcon />
                </Button>
              }
            />

            <MenuPopup className="flex min-w-fit flex-row *:size-5 *:items-center *:justify-center *:p-0">
              <MenuItem
                onClick={() => column.pin("left")}
                disabled={columnPinned === "left"}
              >
                <ArrowLeftIcon />
              </MenuItem>
              <MenuItem
                variant="destructive"
                onClick={() => column.pin(false)}
                disabled={columnPinned === false}
              >
                <XIcon />
              </MenuItem>
              <MenuItem
                onClick={() => column.pin("right")}
                disabled={columnPinned === "right"}
              >
                <ArrowRightIcon />
              </MenuItem>
            </MenuPopup>
          </Menu>
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
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      indeterminate={table.getIsSomePageRowsSelected()}
      checked={table.getIsAllPageRowsSelected()}
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

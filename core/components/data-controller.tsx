"use client";

import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { Table } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EyeIcon,
  SearchIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { defaultPageSize, pageSizes } from "../hooks/use-data-controller";
import { cn, formatNumber } from "../utils";
import { Button, ButtonProps } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Kbd } from "./ui/kbd";
import { Menu, MenuCheckboxItem, MenuPopup, MenuTrigger } from "./ui/menu";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function DataControllerVisibility<TData>({
  table,
  align,
  shortcut = "V",
  size = "default",
  variant = "outline",
  className,
  ...props
}: ButtonProps & {
  table: Table<TData>;
  align?: React.ComponentProps<typeof MenuPopup>["align"];
  shortcut?: Hotkey;
}) {
  const [isOpen, setisOpen] = useState<boolean>(false);
  useHotkey(shortcut, () => setisOpen((v) => !v));

  return (
    <Menu open={isOpen} onOpenChange={setisOpen}>
      <MenuTrigger
        render={
          <Button size={size} variant={variant} {...props}>
            <EyeIcon /> {!size?.startsWith("icon") && "Lihat"}{" "}
            <Kbd className="hidden text-xs lg:inline-flex">
              {formatForDisplay(shortcut)}
            </Kbd>
          </Button>
        }
      />

      <MenuPopup align={align} className={cn(className)}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const cbId = `data-controller-visibility-cb-${column.id}`;
            const label = column.columnDef.meta?.label ?? column.id;
            const isVisible = column.getIsVisible();
            const Icon = column.columnDef.meta?.icon;
            return (
              <MenuCheckboxItem
                key={cbId}
                checked={isVisible}
                onCheckedChange={(v) => column.toggleVisibility(v)}
              >
                <div className="flex items-center gap-x-2">
                  {Icon && <Icon className="text-muted-foreground" />} {label}
                </div>
              </MenuCheckboxItem>
            );
          })}
      </MenuPopup>
    </Menu>
  );
}

export const SORT_ICONS = { asc: ArrowUpIcon, desc: ArrowDownIcon };

export function DataControllerSorting<TData>({
  table,
  align,
  isMulti = true,
  shortcut = "S",
  size = "default",
  variant = "outline",
  className,
  ...props
}: ButtonProps & {
  table: Table<TData>;
  align?: React.ComponentProps<typeof MenuPopup>["align"];
  isMulti?: boolean;
  shortcut?: Hotkey;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useHotkey(shortcut, () => setIsOpen((v) => !v));

  return (
    <Menu open={isOpen} onOpenChange={setIsOpen}>
      <MenuTrigger
        render={
          <Button size={size} variant={variant} {...props}>
            <ArrowUpDownIcon /> {!size?.startsWith("icon") && "Sortir"}{" "}
            <Kbd className="hidden text-xs lg:inline-flex">
              {formatForDisplay(shortcut)}
            </Kbd>
          </Button>
        }
      />

      <MenuPopup align={align} className={cn(className)}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanSort())
          .map((column) => {
            const sort = column.getIsSorted();
            const label = column.columnDef.meta?.label ?? column.id;
            const Icon = column.columnDef.meta?.icon;
            const SortIcon = sort ? SORT_ICONS[sort] : null;

            return (
              <MenuCheckboxItem
                key={`data-controller-sorting-${column.id}`}
                checked={Boolean(sort)}
                onCheckedChange={() => {
                  if (sort === "asc") column.toggleSorting(true, isMulti);
                  else if (sort === "desc") column.clearSorting();
                  else column.toggleSorting(false, isMulti);
                }}
                checkIcon={SortIcon ? <SortIcon /> : undefined}
              >
                <div className="flex items-center gap-x-2">
                  {Icon && <Icon className="text-muted-foreground" />} {label}
                </div>
              </MenuCheckboxItem>
            );
          })}
      </MenuPopup>
    </Menu>
  );
}

export function DataControllerSearch<TData>({
  table,
  placeholder = "Cari...",
  className,
  shortcut = "/",
  ...props
}: Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "ref" | "value" | "onChange"
> & { table: Table<TData>; shortcut?: Hotkey }) {
  const searchRef = useRef<HTMLInputElement>(null);
  useHotkey(shortcut, () => searchRef.current?.focus());

  return (
    <InputGroup className={cn(className)}>
      <InputGroupInput
        ref={searchRef}
        placeholder={placeholder}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        {...props}
      />

      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end" className="hidden lg:inline-flex">
        <Kbd>{formatForDisplay(shortcut)}</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}

export function DataControllerPaginationNav<TData>({
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

export function DataControllerPageSize<TData>({
  table,
  initialSizeState,
  className,
  ...props
}: React.ComponentProps<typeof SelectTrigger> & {
  table: Table<TData>;
  initialSizeState?: number;
}) {
  const value =
    table.getState().pagination.pageSize ?? initialSizeState ?? defaultPageSize;

  return (
    <Select
      value={String(value)}
      onValueChange={(v) => table.setPageSize(Number(v))}
    >
      <SelectTrigger className={cn("min-w-fit", className)} {...props}>
        <SelectValue />
      </SelectTrigger>

      <SelectPopup>
        {pageSizes.map((v) => (
          <SelectItem
            key={v}
            value={String(v)}
            className={cn(v === defaultPageSize && "font-semibold")}
          >
            {formatNumber(v)}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

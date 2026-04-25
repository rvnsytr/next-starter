"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
  ViewIcon,
} from "lucide-react";
import { useRef } from "react";
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
  size = "default",
  variant = "outline",
  className,
  ...props
}: ButtonProps & {
  table: Table<TData>;
  align?: React.ComponentProps<typeof MenuPopup>["align"];
}) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button size={size} variant={variant} {...props}>
            <ViewIcon /> {!size?.startsWith("icon") && "Lihat"}
          </Button>
        }
      />

      <MenuPopup align={align} className={cn(className)}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const cbId = `data-controller-visibility-cb-${column.id}`;
            const isVisible = column.getIsVisible();
            const Icon = column.columnDef.meta?.icon;
            return (
              <MenuCheckboxItem
                key={cbId}
                variant="switch"
                checked={isVisible}
                onCheckedChange={(v) => column.toggleVisibility(v)}
              >
                <div className="flex items-center gap-x-2">
                  {Icon && <Icon />}
                  {column.columnDef.meta?.label ?? column.id}
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
  ...props
}: Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "ref" | "value" | "onChange"
> & { table: Table<TData> }) {
  const searchRef = useRef<HTMLInputElement>(null);
  useHotkey("/", () => searchRef.current?.focus());

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

      <InputGroupAddon align="inline-end">
        {/* <Kbd>⌘</Kbd> */}
        <Kbd>/</Kbd>
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
        disabled={Boolean(disabled || !table.getCanPreviousPage())}
        {...props}
      >
        <ChevronsLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.previousPage()}
        disabled={Boolean(disabled || !table.getCanPreviousPage())}
        {...props}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.nextPage()}
        disabled={Boolean(disabled || !table.getCanNextPage())}
        {...props}
      >
        <ChevronRightIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.lastPage()}
        disabled={Boolean(disabled || !table.getCanNextPage())}
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
  size = "sm",
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
      <SelectTrigger size={size} {...props}>
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

"use client";

import {
  Button,
  ButtonIconSize,
  ButtonProps,
} from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Menu,
  MenuCheckboxItem,
  MenuPopup,
  MenuTrigger,
} from "@/core/components/ui/menu";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import React, { useState } from "react";
import { coreTable } from "../hooks/core-table";
import { TableMeta } from "../types";

export type ColumnSortingMenuProps = ButtonProps & {
  size?: ButtonIconSize;
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  shortcut?: "default" | Hotkey;
};

const DEFAULT_HOTKEY: Hotkey = "S";
const SORT_ICONS = { asc: ArrowUpIcon, desc: ArrowDownIcon };

export function ColumnSortingMenu({
  align,
  shortcut,
  size = "icon",
  variant = "outline",
  className,
  children,
  ...props
}: ColumnSortingMenuProps & { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hotkey = shortcut === "default" ? DEFAULT_HOTKEY : shortcut;
  useHotkey(hotkey ?? DEFAULT_HOTKEY, () => setIsOpen((prev) => !prev), {
    enabled: !!hotkey,
  });

  return (
    <Menu open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <MenuTrigger
              render={
                <Button size={size} variant={variant} {...props}>
                  <ArrowUpDownIcon />
                </Button>
              }
            />
          }
        />

        <TooltipPopup align={align}>
          Sort Columns
          {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
        </TooltipPopup>
      </Tooltip>

      <MenuPopup align={align} className={cn(className)}>
        {children}
      </MenuPopup>
    </Menu>
  );
}

export function ColumnSortingMenuItem({
  id: columnId,
  meta,
  ...props
}: React.ComponentProps<typeof MenuCheckboxItem> & { meta?: TableMeta }) {
  return (
    <MenuCheckboxItem id={`sorting-cb-${columnId}`} {...props}>
      <div className="flex items-center gap-x-2">
        {meta?.icon && <meta.icon className="text-muted-foreground" />}
        {meta?.label ?? columnId}
      </div>
    </MenuCheckboxItem>
  );
}

export function DataTableColumnSortingMenu(props: ColumnSortingMenuProps) {
  const table = coreTable.useTableContext();
  return (
    <ColumnSortingMenu {...props}>
      {table
        .getAllColumns()
        .filter((column) => column.getCanSort() || column.getCanMultiSort())
        .map((column) => {
          const sort = column.getIsSorted();
          const SortIcon = sort ? SORT_ICONS[sort] : null;
          return (
            <ColumnSortingMenuItem
              key={column.id}
              id={column.id}
              meta={column.columnDef.meta}
              checked={Boolean(sort)}
              onCheckedChange={() => {
                if (sort === "asc") column.toggleSorting(true, true);
                else if (sort === "desc") column.clearSorting();
                else column.toggleSorting(false, true);
              }}
              checkIcon={SortIcon ? <SortIcon /> : undefined}
            />
          );
        })}
    </ColumnSortingMenu>
  );
}

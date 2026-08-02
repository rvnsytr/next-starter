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
import { ArrowUpDownIcon } from "lucide-react";
import React, { useState } from "react";
import { SORT_ICONS } from "../constants";
import { coreTable } from "../hooks/core-table";
import { TableMeta } from "../types";

export type ColumnSortMenuProps = ButtonProps & {
  size?: ButtonIconSize;
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  shortcut?: "default" | Hotkey;
};

const DEFAULT_HOTKEY: Hotkey = "S";

export function ColumnSortMenu({
  align,
  shortcut,
  size = "icon",
  variant = "outline",
  className,
  children,
  ...props
}: ColumnSortMenuProps & { children: React.ReactNode }) {
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

export function ColumnSortMenuItem({
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

export function CoreTableColumnSortMenu(props: ColumnSortMenuProps) {
  const table = coreTable.useTableContext();
  return (
    <ColumnSortMenu {...props}>
      {table
        .getAllColumns()
        .filter((column) => column.getCanSort() || column.getCanMultiSort())
        .map((column) => {
          const sortDirection = column.getIsSorted();
          const SortIcon = sortDirection ? SORT_ICONS[sortDirection] : null;
          return (
            <ColumnSortMenuItem
              key={column.id}
              id={column.id}
              meta={column.columnDef.meta}
              checked={Boolean(sortDirection)}
              onCheckedChange={() => {
                if (sortDirection === "asc") column.toggleSorting(true, true);
                else if (sortDirection === "desc") column.clearSorting();
                else column.toggleSorting(false, true);
              }}
              checkIcon={SortIcon ? <SortIcon /> : undefined}
            />
          );
        })}
    </ColumnSortMenu>
  );
}

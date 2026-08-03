"use client";

import { Button, ButtonProps } from "@/core/components/ui/button";
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
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";
import { SORT_ICONS } from "../constants";
import { coreTable } from "../hooks/core-table";
import { TableMeta } from "../types";

export type ColumnSortMenuProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  shortcut?: "default" | Hotkey;
};

export const COLUMN_SORT_DEFAULT_HOTKEY: Hotkey = "S";

export function ColumnSortMenu({
  shortcut,
  align = "center",
  size = "icon",
  variant = "outline",
  children,
  renderMenuItems,
  ...props
}: ColumnSortMenuProps & { renderMenuItems: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isIconSize = size?.startsWith("icon");
  const hotkey = shortcut === "default" ? COLUMN_SORT_DEFAULT_HOTKEY : shortcut;

  useHotkey(
    hotkey ?? COLUMN_SORT_DEFAULT_HOTKEY,
    () => setIsOpen((prev) => !prev),
    { enabled: !!hotkey },
  );

  return (
    <Menu open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <MenuTrigger
              render={
                <Button size={size} variant={variant} {...props}>
                  {children ?? (isIconSize && <ArrowUpDownIcon />)}
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

      <MenuPopup align={align}>{renderMenuItems}</MenuPopup>
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
    <ColumnSortMenu
      renderMenuItems={table
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
      {...props}
    />
  );
}

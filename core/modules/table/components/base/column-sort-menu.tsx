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
import { SORT_ICONS } from "@/core/modules/table/constants";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";

export type ColumnSortMenuProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "S" */
  shortcut?: "default" | Hotkey;
};

export const COLUMN_SORT_DEFAULT_HOTKEY: Hotkey = "S";

export function ColumnSortMenu({
  tableType,
  shortcut,
  align = "center",
  size = "default",
  variant = "outline",
  children,
  ...props
}: ColumnSortMenuProps & { tableType: DataTableType }) {
  const table = getTableHook(tableType).useTableContext();

  const [isOpen, setIsOpen] = useState<boolean>(false);

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
                  {children ?? (
                    <>
                      <ArrowUpDownIcon /> Sort
                    </>
                  )}
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

      <MenuPopup align={align}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanSort() || column.getCanMultiSort())
          .map((column) => {
            const Icon = column.columnDef.meta?.icon;
            const sortDirection = column.getIsSorted();
            const SortIcon = sortDirection ? SORT_ICONS[sortDirection] : null;
            return (
              <MenuCheckboxItem
                key={column.id}
                id={`sorting-btn-${column.id}`}
                checked={Boolean(sortDirection)}
                onCheckedChange={() => {
                  if (sortDirection === "asc") column.toggleSorting(true, true);
                  else if (sortDirection === "desc") column.clearSorting();
                  else column.toggleSorting(false, true);
                }}
                checkIcon={SortIcon ? <SortIcon /> : undefined}
              >
                <div className="flex gap-2">
                  {Icon && <Icon className="text-muted-foreground" />}
                  {column.columnDef.meta?.label ?? column.id}
                </div>
              </MenuCheckboxItem>
            );
          })}
      </MenuPopup>
    </Menu>
  );
}

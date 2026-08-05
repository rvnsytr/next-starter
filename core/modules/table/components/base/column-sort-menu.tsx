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
  size,
  variant = "outline",
  children,
  ...props
}: ColumnSortMenuProps & { tableType: DataTableType }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const table = getTableHook(tableType).useTableContext();

  const hotkey = shortcut === "default" ? COLUMN_SORT_DEFAULT_HOTKEY : shortcut;

  const buttonSize: ButtonProps["size"] =
    size ?? (children ? "default" : "icon");
  const isIconSize = buttonSize.startsWith("icon");

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
                <Button size={buttonSize} variant={variant} {...props}>
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

      <MenuPopup align={align}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanSort() || column.getCanMultiSort())
          .map((column) => {
            const { meta } = column.columnDef;
            return (
              <MenuCheckboxItem key={column.id} id={`sorting-btn-${column.id}`}>
                {meta?.icon && <meta.icon className="text-muted-foreground" />}
                {meta?.label ?? column.id}
              </MenuCheckboxItem>
            );
          })}
      </MenuPopup>
    </Menu>
  );
}

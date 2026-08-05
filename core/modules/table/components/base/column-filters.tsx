"use client";

import {
  Button,
  ButtonIconSize,
  ButtonProps,
} from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Menu,
  MenuItem,
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
import { FilterIcon } from "lucide-react";
import { useState } from "react";

export type ColumnFiltersProps = ButtonProps & {
  size?: ButtonIconSize;
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "F" */
  shortcut?: "default" | Hotkey;
};

const FILTERS_DEFAULT_HOTKEY: Hotkey = "F";

export function ColumnFilters({
  tableType,
  shortcut,
  align = "center",
  size,
  variant = "outline",
  children,
  ...props
}: ColumnFiltersProps & { tableType: DataTableType }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const table = getTableHook(tableType).useTableContext();

  const hotkey = shortcut === "default" ? FILTERS_DEFAULT_HOTKEY : shortcut;

  const buttonSize: ButtonProps["size"] =
    size ?? (children ? "default" : "icon");
  const isIconSize = buttonSize.startsWith("icon");

  useHotkey(
    hotkey ?? FILTERS_DEFAULT_HOTKEY,
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
                  {children ?? (isIconSize && <FilterIcon />)}
                </Button>
              }
            />
          }
        />

        <TooltipPopup align={align}>
          Filter Columns
          {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
        </TooltipPopup>
      </Tooltip>

      <MenuPopup align={align}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanFilter())
          .map((column) => {
            const { meta } = column.columnDef;
            return (
              <MenuItem key={column.id} id={`filter-btn-${column.id}`}>
                {meta?.icon && <meta.icon className="text-muted-foreground" />}
                {meta?.label ?? column.id}
              </MenuItem>
            );
          })}
      </MenuPopup>
    </Menu>
  );
}

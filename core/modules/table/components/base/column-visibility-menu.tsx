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
import { EyeIcon } from "lucide-react";
import { useState } from "react";

export type ColumnVisibilityMenuProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "V" */
  shortcut?: "default" | Hotkey;
};

const COLUMN_VISIBILITY_DEFAULT_HOTKEY: Hotkey = "V";

export function ColumnVisibilityMenu({
  tableType,
  shortcut,
  align = "center",
  size,
  variant = "outline",
  children,
  ...props
}: ColumnVisibilityMenuProps & { tableType: DataTableType }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const table = getTableHook(tableType).useTableContext();

  const buttonSize: ButtonProps["size"] =
    size ?? (children ? "default" : "icon");
  const isIconSize = buttonSize.startsWith("icon");

  const hotkey =
    shortcut === "default" ? COLUMN_VISIBILITY_DEFAULT_HOTKEY : shortcut;

  useHotkey(
    hotkey ?? COLUMN_VISIBILITY_DEFAULT_HOTKEY,
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
                  {children ?? (isIconSize && <EyeIcon />)}
                </Button>
              }
            />
          }
        />

        <TooltipPopup align={align}>
          View Columns
          {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
        </TooltipPopup>
      </Tooltip>

      <MenuPopup align={align}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const Icon = column.columnDef.meta?.icon;
            return (
              <MenuCheckboxItem
                key={column.id}
                id={`visibility-cb-${column.id}`}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
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

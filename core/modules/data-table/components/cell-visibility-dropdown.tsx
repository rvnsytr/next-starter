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
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { dataTable } from "../table-hook";

const DEFAULT_HOTKEY: Hotkey = "V";

export function CellVisibilityDropdown({
  align,
  shortcut,
  size = "icon",
  variant = "outline",
  className,
  ...props
}: ButtonProps & {
  size?: ButtonIconSize;
  align?: React.ComponentProps<typeof MenuPopup>["align"];
  shortcut?: "default" | Hotkey;
}) {
  const table = dataTable.useTableContext();
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
                  <EyeIcon />
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

      <MenuPopup align={align} className={cn(className)}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const cbId = `cell-visibility-cb-${column.id}`;
            const label = column.columnDef.meta?.label ?? column.id;
            const Icon = column.columnDef.meta?.icon;
            return (
              <MenuCheckboxItem
                key={cbId}
                checked={column.getIsVisible()}
                onCheckedChange={() => column.toggleVisibility()}
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

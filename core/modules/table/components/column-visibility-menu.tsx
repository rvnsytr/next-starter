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
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { coreTable } from "../hooks/core-table";
import { TableMeta } from "../types";

export type ColumnVisibilityMenuProps = ButtonProps & {
  size?: ButtonIconSize;
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  shortcut?: "default" | Hotkey;
};

const COLUMN_VISIBILITY_DEFAULT_HOTKEY: Hotkey = "V";

export function ColumnVisibilityMenu({
  shortcut,
  align = "center",
  size = "icon",
  variant = "outline",
  children,
  renderMenuItems,
  ...props
}: ColumnVisibilityMenuProps & { renderMenuItems: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isIconSize = size?.startsWith("icon");
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
                <Button size={size} variant={variant} {...props}>
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

      <MenuPopup align={align}>{renderMenuItems}</MenuPopup>
    </Menu>
  );
}

export function ColumnVisibilityMenuItem({
  id: columnId,
  meta,
  ...props
}: React.ComponentProps<typeof MenuCheckboxItem> & { meta?: TableMeta }) {
  return (
    <MenuCheckboxItem id={`visibility-cb-${columnId}`} {...props}>
      <div className="flex items-center gap-x-2">
        {meta?.icon && <meta.icon className="text-muted-foreground" />}
        {meta?.label ?? columnId}
      </div>
    </MenuCheckboxItem>
  );
}

export function CoreTableColumnVisibilityMenu(
  props: ColumnVisibilityMenuProps,
) {
  const table = coreTable.useTableContext();
  return (
    <ColumnVisibilityMenu
      renderMenuItems={table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => (
          <ColumnVisibilityMenuItem
            key={column.id}
            id={column.id}
            meta={column.columnDef.meta}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          />
        ))}
      {...props}
    />
  );
}

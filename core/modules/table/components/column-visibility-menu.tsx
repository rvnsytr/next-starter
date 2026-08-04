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
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { dataTable } from "../hooks/data-table";
import { TableMeta } from "../types";

export type VisibilityMenuProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "V" */
  shortcut?: "default" | Hotkey;
};

export type VisibilityCheckboxProps = React.ComponentProps<
  typeof MenuCheckboxItem
> & { id: string; meta?: TableMeta };

const COLUMN_VISIBILITY_DEFAULT_HOTKEY: Hotkey = "V";

export function VisibilityMenu({
  shortcut,
  align = "center",
  size,
  variant = "outline",
  children,
  checkboxesProps,
  ...props
}: VisibilityMenuProps & {
  checkboxesProps: VisibilityCheckboxProps[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        {checkboxesProps.map(({ id, meta, ...itemProps }) => (
          <MenuCheckboxItem key={id} id={`visibility-cb-${id}`} {...itemProps}>
            <div className="flex items-center gap-x-2">
              {meta?.icon && <meta.icon className="text-muted-foreground" />}
              {meta?.label ?? id}
            </div>
          </MenuCheckboxItem>
        ))}
      </MenuPopup>
    </Menu>
  );
}

export function DataTableVisibilityMenu(props: VisibilityMenuProps) {
  const table = dataTable.useTableContext();
  return (
    <VisibilityMenu
      checkboxesProps={table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => ({
          id: column.id,
          meta: column.columnDef.meta,
          checked: column.getIsVisible(),
          onCheckedChange: (value) => column.toggleVisibility(!!value),
        }))}
      {...props}
    />
  );
}

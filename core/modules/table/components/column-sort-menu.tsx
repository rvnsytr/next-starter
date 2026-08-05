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
import { dataTable } from "../hooks/data-table";
import { TableMeta } from "../types";

export type ColumnSortMenuProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "S" */
  shortcut?: "default" | Hotkey;
};

export type SortCheckboxProps = React.ComponentProps<
  typeof MenuCheckboxItem
> & { id: string; meta?: TableMeta };

export const COLUMN_SORT_DEFAULT_HOTKEY: Hotkey = "S";

export function ColumnSortMenu({
  shortcut,
  align = "center",
  size,
  variant = "outline",
  children,
  checkboxesProps,
  ...props
}: ColumnSortMenuProps & { checkboxesProps: SortCheckboxProps[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const buttonSize: ButtonProps["size"] =
    size ?? (children ? "default" : "icon");
  const isIconSize = buttonSize.startsWith("icon");

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
        {checkboxesProps.map(({ id, meta, ...itemProps }) => (
          <MenuCheckboxItem key={id} id={`sorting-cb-${id}`} {...itemProps}>
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

export function DataTableColumnSortMenu(props: ColumnSortMenuProps) {
  const table = dataTable.useTableContext();
  return (
    <ColumnSortMenu
      checkboxesProps={table
        .getAllColumns()
        .filter((column) => column.getCanSort() || column.getCanMultiSort())
        .map((column) => {
          const sortDirection = column.getIsSorted();
          const SortIcon = sortDirection ? SORT_ICONS[sortDirection] : null;
          return {
            id: column.id,
            meta: column.columnDef.meta,
            checked: Boolean(sortDirection),
            onCheckedChange: () => {
              if (sortDirection === "asc") column.toggleSorting(true, true);
              else if (sortDirection === "desc") column.clearSorting();
              else column.toggleSorting(false, true);
            },
            checkIcon: SortIcon ? <SortIcon /> : undefined,
          };
        })}
      {...props}
    />
  );
}

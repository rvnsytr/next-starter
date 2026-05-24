"use client";

import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkeys } from "@tanstack/react-hotkeys";
import { Table } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import { Button, ButtonProps } from "../ui/button";
import { Kbd } from "../ui/kbd";
import { Menu, MenuCheckboxItem, MenuPopup, MenuTrigger } from "../ui/menu";

export const SORT_ICONS = { asc: ArrowUpIcon, desc: ArrowDownIcon };

export function Sorting<TData>({
  table,
  align,
  isMulti = true,
  shortcut,
  size = "default",
  variant = "outline",
  className,
  ...props
}: ButtonProps & {
  table: Table<TData>;
  align?: React.ComponentProps<typeof MenuPopup>["align"];
  isMulti?: boolean;
  shortcut?: Hotkey;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useHotkeys(
    shortcut
      ? [{ hotkey: shortcut, callback: () => setIsOpen((v) => !v) }]
      : [],
    { enabled: !!shortcut },
  );

  const isIconSize = size?.startsWith("icon") ?? false;

  return (
    <Menu open={isOpen} onOpenChange={setIsOpen}>
      <MenuTrigger
        render={
          <Button size={size} variant={variant} {...props}>
            <ArrowUpDownIcon />
            {!isIconSize && "Sortir"}
            {!isIconSize && shortcut && (
              <Kbd className="hidden text-xs lg:inline-flex">
                {formatForDisplay(shortcut)}
              </Kbd>
            )}
          </Button>
        }
      />

      <MenuPopup align={align} className={cn(className)}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanSort())
          .map((column) => {
            const sort = column.getIsSorted();
            const label = column.columnDef.meta?.label ?? column.id;
            const Icon = column.columnDef.meta?.icon;
            const SortIcon = sort ? SORT_ICONS[sort] : null;

            return (
              <MenuCheckboxItem
                key={`data-controller-sorting-${column.id}`}
                checked={Boolean(sort)}
                onCheckedChange={() => {
                  if (sort === "asc") column.toggleSorting(true, isMulti);
                  else if (sort === "desc") column.clearSorting();
                  else column.toggleSorting(false, isMulti);
                }}
                checkIcon={SortIcon ? <SortIcon /> : undefined}
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

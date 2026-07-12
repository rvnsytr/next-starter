"use client";

import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkeys } from "@tanstack/react-hotkeys";
import { Table } from "@tanstack/react-table";
import { Columns3Icon } from "lucide-react";
import { useState } from "react";
import { Button, ButtonProps } from "../ui/button";
import { Kbd } from "../ui/kbd";
import { Menu, MenuCheckboxItem, MenuPopup, MenuTrigger } from "../ui/menu";

export function Visibility<TData>({
  table,
  align,
  shortcut,
  size = "default",
  variant = "outline",
  className,
  ...props
}: ButtonProps & {
  table: Table<TData>;
  align?: React.ComponentProps<typeof MenuPopup>["align"];
  /** @default "V" */
  shortcut?: Hotkey | "default";
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hotkey = shortcut === "default" ? "V" : shortcut;

  useHotkeys(hotkey ? [{ hotkey, callback: () => setIsOpen((v) => !v) }] : [], {
    enabled: !!hotkey,
  });

  const isIconSize = size?.startsWith("icon") ?? false;

  return (
    <Menu open={isOpen} onOpenChange={setIsOpen}>
      <MenuTrigger
        render={
          <Button size={size} variant={variant} {...props}>
            <Columns3Icon />
            {!isIconSize && "Kolom"}
            {!isIconSize && hotkey && (
              <Kbd className="hidden text-xs lg:inline-flex">
                {formatForDisplay(hotkey)}
              </Kbd>
            )}
          </Button>
        }
      />

      <MenuPopup align={align} className={cn(className)}>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const cbId = `data-controller-visibility-cb-${column.id}`;
            const label = column.columnDef.meta?.label ?? column.id;
            const isVisible = column.getIsVisible();
            const Icon = column.columnDef.meta?.icon;
            return (
              <MenuCheckboxItem
                key={cbId}
                checked={isVisible}
                onCheckedChange={(v) => column.toggleVisibility(v)}
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

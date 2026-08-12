import { Button, ButtonProps } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import { Menu, MenuPopup, MenuTrigger } from "@/core/components/ui/menu";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import type { ColumnMeta } from "@/core/modules/table/types";
import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";

export type ColumnSortMenuProps = Omit<ButtonProps, "children"> & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "S" */
  shortcut?: "default" | Hotkey;

  renderTrigger?: React.ReactElement;
};

export const COLUMN_SORT_DEFAULT_HOTKEY: Hotkey = "S";

export function ColumnSortMenu({
  align = "center",
  shortcut,
  renderTrigger,
  renderPopupContent,
  size = "default",
  variant = "outline",
  ...props
}: ColumnSortMenuProps & { renderPopupContent: React.ReactNode }) {
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
                renderTrigger ?? (
                  <Button size={size} variant={variant} {...props}>
                    <ArrowUpDownIcon /> Sort
                  </Button>
                )
              }
            />
          }
        />

        <TooltipPopup align={align}>
          Sort Columns
          {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
        </TooltipPopup>
      </Tooltip>

      <MenuPopup align={align}>{renderPopupContent}</MenuPopup>
    </Menu>
  );
}

export function ColumnSortMenuItemContent({
  columnId,
  meta,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  columnId: string;
  meta?: ColumnMeta;
}) {
  const Icon = meta?.icon;
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {Icon && <Icon className="text-muted-foreground" />}
      {meta?.label ?? columnId}
    </div>
  );
}

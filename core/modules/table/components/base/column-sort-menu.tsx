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
import {
  formatForDisplay,
  HotkeySequence,
  useHotkeySequence,
} from "@tanstack/react-hotkeys";
import { ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";

export type ColumnSortMenuProps = Omit<ButtonProps, "children"> & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /**
   * Keyboard shortcut used to open the column sort menu.
   * If set to "default", the default shortcut (S) is used.
   */
  shortcut?: "default" | HotkeySequence;

  renderTrigger?: React.ReactElement;
};

const DEFAULT_SHORTCUT: HotkeySequence = ["S"];

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

  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;

  useHotkeySequence(
    hotkeySequence ?? DEFAULT_SHORTCUT,
    () => setIsOpen((prev) => !prev),
    { enabled: !!hotkeySequence },
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
          {hotkeySequence && (
            <Kbd className="ml-1">
              {hotkeySequence.map((k) => formatForDisplay(k)).join("+")}
            </Kbd>
          )}
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

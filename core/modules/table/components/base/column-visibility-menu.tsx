import { Button, ButtonProps } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import { Menu, MenuPopup, MenuTrigger } from "@/core/components/ui/menu";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { ColumnMeta } from "@/core/modules/table/types";
import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { EyeIcon } from "lucide-react";
import { useState } from "react";

export type ColumnVisibilityMenuProps = Omit<ButtonProps, "children"> & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "V" */
  shortcut?: "default" | Hotkey;

  renderTrigger?: React.ReactElement;
};

const COLUMN_VISIBILITY_DEFAULT_HOTKEY: Hotkey = "V";

export function ColumnVisibilityMenu({
  align = "center",
  shortcut,
  renderTrigger,
  renderPopupContent,
  size = "default",
  variant = "outline",
  ...props
}: ColumnVisibilityMenuProps & { renderPopupContent: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
                renderTrigger ?? (
                  <Button size={size} variant={variant} {...props}>
                    <EyeIcon /> Columns
                  </Button>
                )
              }
            />
          }
        />

        <TooltipPopup align={align}>
          View Columns
          {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
        </TooltipPopup>
      </Tooltip>

      <MenuPopup align={align}>{renderPopupContent}</MenuPopup>
    </Menu>
  );
}

export function ColumnVisibilityMenuItemContent({
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

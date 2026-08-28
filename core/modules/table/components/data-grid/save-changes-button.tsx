import { Button, ButtonProps } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import {
  formatForDisplay,
  HotkeySequence,
  useHotkeySequence,
} from "@tanstack/react-hotkeys";
import { ListCheckIcon } from "lucide-react";
import { useDataGrid } from "./provider";

export type SaveChangesButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /**
   * Keyboard shortcut used to trigger the table reset action.
   * If set to "default", the default shortcut (Control+S) is used.
   */
  shortcut?: "default" | HotkeySequence;
};

const DEFAULT_SHORTCUT: HotkeySequence = ["Control+S"];

export function DataGridSaveChangesButton({
  shortcut,
  align = "center",
  size = "default",
  variant = "outline",
  onClick,
  ...props
}: SaveChangesButtonProps) {
  const table = dataGrid.useTableContext();
  const { getChanges, clearChanges } = useDataGrid();

  const onSave = () => {
    table.options.meta?.onSave?.(getChanges());
    clearChanges();
    table.options.meta?.onChange?.(getChanges());
  };

  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkeySequence(hotkeySequence ?? DEFAULT_SHORTCUT, () => onSave(), {
    enabled: !!hotkeySequence,
  });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={size}
            variant={variant}
            onClick={(e) => {
              onSave();
              onClick?.(e);
            }}
            {...props}
          >
            <ListCheckIcon /> Save Changes
          </Button>
        }
      />

      <TooltipPopup align={align}>
        Save All Changes
        {hotkeySequence && (
          <Kbd className="ml-1">
            {hotkeySequence.map((k) => formatForDisplay(k)).join("+")}
          </Kbd>
        )}
      </TooltipPopup>
    </Tooltip>
  );
}

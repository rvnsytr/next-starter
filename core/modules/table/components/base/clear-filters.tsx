import { Button, ButtonProps } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { FilterXIcon } from "lucide-react";

export type ClearFiltersProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  side?: React.ComponentProps<typeof TooltipPopup>["side"];

  /**
   * Keyboard shortcut used to trigger the clear filters action.
   * If set to "default", the default shortcut (C) is used.
   */
  shortcut?: "default" | Hotkey;
};

type ClearFiltersContext = {
  onClear: () => void;
};

const DEFAULT_SHORTCUT: Hotkey = ["C"];

export function ClearFilters({
  context,
  shortcut,
  align,
  side,
  size = "sm",
  variant = "destructive-outline",
  onClick,
  children,
  ...props
}: ClearFiltersProps & { context: ClearFiltersContext }) {
  const hotkey = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkey(hotkey ?? DEFAULT_SHORTCUT, () => context.onClear(), {
    enabled: !!hotkey,
  });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={size}
            variant={variant}
            onClick={(e) => {
              onClick?.(e);
              context.onClear();
            }}
            {...props}
          >
            {children ?? (
              <>
                <FilterXIcon /> Clear
              </>
            )}
          </Button>
        }
      />
      <TooltipPopup align={align} side={side}>
        Clear All Filters
        {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
      </TooltipPopup>
    </Tooltip>
  );
}

import { Button, ButtonProps } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import {
  formatForDisplay,
  HotkeySequence,
  useHotkeySequence,
} from "@tanstack/react-hotkeys";
import { FilterXIcon } from "lucide-react";

export type ClearFiltersProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  side?: React.ComponentProps<typeof TooltipPopup>["side"];

  /**
   * Keyboard shortcut used to trigger the clear filters action.
   * If set to "default", the default shortcut (R, R) is used.
   */
  shortcut?: "default" | HotkeySequence;
};

type ClearFiltersContext = {
  onClear: () => void;
};

const DEFAULT_SHORTCUT: HotkeySequence = ["R"];

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
  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;

  useHotkeySequence(
    hotkeySequence ?? DEFAULT_SHORTCUT,
    () => context.onClear(),
    { enabled: !!hotkeySequence },
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={size}
            variant={variant}
            onClick={(e) => {
              context.onClear();
              onClick?.(e);
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
        {hotkeySequence && (
          <Kbd className="ml-1">
            {hotkeySequence.map((k) => formatForDisplay(k)).join("+")}
          </Kbd>
        )}
      </TooltipPopup>
    </Tooltip>
  );
}

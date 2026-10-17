import { Button, ButtonProps } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { RotateCcwIcon } from "lucide-react";

export type ResetTableButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /**
   * Keyboard shortcut used to trigger the table reset action.
   * If set to "default", the default shortcut (Alt+R) is used.
   */
  shortcut?: "default" | Hotkey;
};

type ResetTableButtonPropsContext = {
  onReset: () => void;
};

const DEFAULT_SHORTCUT: Hotkey = ["Alt+R"];

export function ResetTableButton({
  context,
  shortcut,
  align = "center",
  size = "default",
  variant = "outline",
  onClick,
  ...props
}: ResetTableButtonProps & { context: ResetTableButtonPropsContext }) {
  const hotkey = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkey(hotkey ?? DEFAULT_SHORTCUT, () => context.onReset(), {
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
              context.onReset();
            }}
            {...props}
          >
            <RotateCcwIcon /> Reset Table
          </Button>
        }
      />

      <TooltipPopup align={align}>
        Reset Table
        {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
      </TooltipPopup>
    </Tooltip>
  );
}

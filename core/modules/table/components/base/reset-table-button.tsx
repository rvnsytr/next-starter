import { ButtonProps, ResetButton } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";

export type ResetTableButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "R" */
  shortcut?: "default" | Hotkey;
};

type ResetTableButtonPropsContext = {
  onReset: () => void;
};

export const TABLE_RESET_DEFAULT_HOTKEY: Hotkey = "R";

export function ResetTableButton({
  context,
  shortcut,
  align = "center",
  size = "default",
  variant = "outline",
  onClick,
  ...props
}: ResetTableButtonProps & { context: ResetTableButtonPropsContext }) {
  const hotkey = shortcut === "default" ? TABLE_RESET_DEFAULT_HOTKEY : shortcut;

  useHotkey(hotkey ?? TABLE_RESET_DEFAULT_HOTKEY, () => context.onReset(), {
    enabled: !!hotkey,
  });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ResetButton
            size={size}
            variant={variant}
            onClick={(e) => {
              context.onReset();
              onClick?.(e);
            }}
            {...props}
          />
        }
      />

      <TooltipPopup align={align}>
        Reset Table
        {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
      </TooltipPopup>
    </Tooltip>
  );
}

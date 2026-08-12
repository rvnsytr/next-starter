import { ButtonProps, ResetButton } from "@/core/components/ui/button";
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

export type ResetTableButtonProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /**
   * Keyboard shortcut used to trigger the table reset action.
   * If set to "default", the default shortcut (R) is used.
   */
  shortcut?: "default" | HotkeySequence;
};

type ResetTableButtonPropsContext = {
  onReset: () => void;
};

const DEFAULT_SHORTCUT: HotkeySequence = ["R"];

export function ResetTableButton({
  context,
  shortcut,
  align = "center",
  size = "default",
  variant = "outline",
  onClick,
  ...props
}: ResetTableButtonProps & { context: ResetTableButtonPropsContext }) {
  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;

  useHotkeySequence(
    hotkeySequence ?? DEFAULT_SHORTCUT,
    () => context.onReset(),
    { enabled: !!hotkeySequence },
  );

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
        {hotkeySequence && (
          <Kbd className="ml-1">
            {hotkeySequence.map((k) => formatForDisplay(k)).join("+")}
          </Kbd>
        )}
      </TooltipPopup>
    </Tooltip>
  );
}

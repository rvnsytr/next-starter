"use client";

import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { useIsMobile } from "@/core/hooks/use-media-query";
import { layoutModeConfig, useLayoutMode } from "@/core/providers/layout-mode";
import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { FrameIcon } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { Kbd } from "./ui/kbd";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";

export const LAYOUT_MODE_TOGGLE_LABEL = "Toggle Layout";
export const LAYOUT_MODE_TOGGLE_HOTKEY: Hotkey = "Alt+L";

export function LayoutModeToggle({
  align,
  withTooltip,
  size = "icon-sm",
  variant = "ghost",
  onClick,
  disabled = false,
  className,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<React.ComponentProps<typeof TooltipPopup>, "align"> & {
    withTooltip?: boolean;
  }) {
  const isMounted = useIsMounted();
  const isMobile = useIsMobile();
  const { layout, setLayout } = useLayoutMode();

  const { icon: Icon } = layoutModeConfig[layout];

  const toggleLayout = () =>
    setLayout((prev) => (prev === "fullwidth" ? "centered" : "fullwidth"));

  useHotkey(LAYOUT_MODE_TOGGLE_HOTKEY, toggleLayout);

  if (!isMounted) {
    return (
      <Button
        size={size}
        variant={variant}
        className={cn("hidden 2xl:inline-flex", className)}
        disabled
      >
        <FrameIcon />
      </Button>
    );
  }

  const element = (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        onClick?.(e);
        toggleLayout();
      }}
      className={cn("hidden 2xl:inline-flex", className)}
      disabled={disabled}
      {...props}
    >
      <Icon />
      <span className="sr-only">{LAYOUT_MODE_TOGGLE_LABEL}</span>
    </Button>
  );

  if (isMobile || !withTooltip) return element;

  return (
    <Tooltip>
      <TooltipTrigger render={element} />
      <TooltipPopup align={align}>
        <div className="flex items-center gap-x-1">
          {LAYOUT_MODE_TOGGLE_LABEL}{" "}
          <Kbd>{formatForDisplay(LAYOUT_MODE_TOGGLE_HOTKEY)}</Kbd>
        </div>
      </TooltipPopup>
    </Tooltip>
  );
}

export function LayoutModeSettings() {
  const { layout, setLayout } = useLayoutMode();

  return (
    <RadioGroup
      value={layout}
      defaultValue="default"
      onValueChange={setLayout}
      className="grid grid-cols-2"
      required
    >
      {Object.entries(layoutModeConfig)
        .filter(([k]) => k !== "unset")
        .map(([k, { label, icon: Icon }]) => (
          <Label key={k} className="justify-center" asCard>
            <RadioGroupItem value={k} hidden />
            <Icon /> {label}
          </Label>
        ))}
    </RadioGroup>
  );
}

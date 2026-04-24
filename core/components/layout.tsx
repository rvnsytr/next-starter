"use client";

import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { useIsMobile } from "@/core/hooks/use-media-query";
import { useLayout } from "@/core/providers/layout";
import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { FrameIcon, LucideIcon, MinimizeIcon, ScanIcon } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { Kbd } from "./ui/kbd";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";

export type LayoutMode = (typeof allLayoutMode)[number];
export const allLayoutMode = ["fullwidth", "centered"] as const;

export const LAYOUT_TOGGLE_HOTKEY: Hotkey = "Alt+L";
export const defaultLayout: LayoutMode = "centered";

export const layoutModeConfig: Record<
  LayoutMode,
  { label: string; icon: LucideIcon }
> = {
  fullwidth: { label: "Fullwidth", icon: ScanIcon },
  centered: { label: "Centered", icon: MinimizeIcon },
};

export function LayoutToggle({
  align,
  size = "icon-sm",
  variant = "ghost",
  onClick,
  disabled = false,
  className,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<React.ComponentProps<typeof TooltipPopup>, "align">) {
  const isMounted = useIsMounted();
  const isMobile = useIsMobile();
  const { layout, setLayout } = useLayout();

  const label = "Toggle Layout";
  const { icon: Icon } = layoutModeConfig[layout];

  const toggleLayout = () =>
    setLayout((prev) => (prev === "fullwidth" ? "centered" : "fullwidth"));

  useHotkey(LAYOUT_TOGGLE_HOTKEY, toggleLayout);

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
      <span className="sr-only">{label}</span>
    </Button>
  );

  if (isMobile) return element;

  return (
    <Tooltip>
      <TooltipTrigger render={element} />
      <TooltipPopup align={align}>
        <div className="flex items-center gap-x-1">
          {label} <Kbd>{formatForDisplay(LAYOUT_TOGGLE_HOTKEY)}</Kbd>
        </div>
      </TooltipPopup>
    </Tooltip>
  );
}

export function LayoutSettings() {
  const { layout, setLayout } = useLayout();

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

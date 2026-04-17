import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { useIsMobile } from "@/core/hooks/use-media-query";
import { useLayout } from "@/core/providers/layout";
import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { FrameIcon, LucideIcon, MinimizeIcon, ScanIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./field";
import { Kbd } from "./kbd";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./tooltip";

export type LayoutMode = (typeof allLayoutMode)[number];
export const allLayoutMode = ["fullwidth", "centered", "unset"] as const;

export const LAYOUT_TOGGLE_HOTKEY: Hotkey = "Alt+L";
export const defaultLayout: LayoutMode = "centered";

export const layoutModeConfig: Record<
  LayoutMode,
  { displayName: string; icon: LucideIcon }
> = {
  fullwidth: { displayName: "Fullwidth", icon: ScanIcon },
  centered: { displayName: "Centered", icon: MinimizeIcon },
  unset: { displayName: "Unset", icon: FrameIcon },
};

export function LayoutToggle({
  align,
  size = "icon-sm",
  variant = "ghost",
  onClick,
  className,
  disabled,
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
    const { icon: DefaultIcon } = layoutModeConfig.unset;
    return (
      <Button size={size} variant={variant} disabled>
        <DefaultIcon />
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
      disabled={disabled ?? layout === "unset"}
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
        .map(([k, { displayName, icon: Icon }]) => (
          <FieldLabel key={k} htmlFor={`rd-theme-${k}`}>
            <Field>
              <FieldContent className="items-center">
                <FieldTitle className="flex-col md:flex-row">
                  <Icon /> {displayName}
                </FieldTitle>
              </FieldContent>
              <RadioGroupItem id={`rd-theme-${k}`} value={k} hidden />
            </Field>
          </FieldLabel>
        ))}
    </RadioGroup>
  );
}

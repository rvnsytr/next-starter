import { formatForDisplay, Hotkey } from "@tanstack/react-hotkeys";
import { LucideIcon, MinimizeIcon, ScanIcon } from "lucide-react";

export type LayoutMode = (typeof allLayoutMode)[number];
export const allLayoutMode = ["fullwidth", "centered"] as const;
export const defaultLayout: LayoutMode = "centered";

export const layoutModeConfig: Record<
  LayoutMode,
  { label: string; icon: LucideIcon }
> = {
  fullwidth: { label: "Fullwidth", icon: ScanIcon },
  centered: { label: "Centered", icon: MinimizeIcon },
};

export const layoutModeToggleConfig: {
  label: string;
  hotkey: Hotkey;
  hotkeyDisplay: string;
} = {
  label: "Toggle Layout",
  hotkey: "L",
  get hotkeyDisplay() {
    return formatForDisplay(this.hotkey);
  },
};

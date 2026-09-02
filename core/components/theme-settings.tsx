"use client";

import { LoadingFallback } from "@/shared/components/fallback";
import { THEME_META } from "@/shared/constants";
import { useTheme } from "next-themes";
import { useIsMounted } from "../hooks/use-is-mounted";
import { useViewTransition } from "../hooks/use-view-transition";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export function ThemeSettings() {
  const isMounted = useIsMounted();
  const { theme: currentTheme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  if (!isMounted) return <LoadingFallback variant="frame" />;

  return (
    <RadioGroup
      value={currentTheme}
      defaultValue="system"
      onValueChange={(v) => startTransition(() => setTheme(v))}
      className="grid grid-cols-3"
      disabled={isTransitioning}
    >
      {Object.entries(THEME_META).map(([k, { icon: Icon }]) => (
        <Label key={k} className="justify-center capitalize" asCard>
          <RadioGroupItem value={k} hidden />
          <Icon /> {k}
        </Label>
      ))}
    </RadioGroup>
  );
}

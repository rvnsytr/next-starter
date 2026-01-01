"use client";

import { Theme, themeMeta } from "@/core/constants";
import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { nextTheme } from "@/core/utils";
import { useTheme } from "next-themes";
import { ComponentProps } from "react";
import { Button, ButtonProps } from "./button";
import { LoadingFallback } from "./fallback";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./field";
import { Kbd, KbdGroup } from "./kbd";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function ThemeToggle({
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<ComponentProps<typeof TooltipContent>, "align">) {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  const currentTheme = (theme ?? "system") as Theme;
  const { icon: Icon } = themeMeta[currentTheme];

  if (!isMounted) {
    const { icon: SystemIcon } = themeMeta.system;
    return (
      <Button size={size} variant={variant} disabled>
        <SystemIcon />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={size}
          variant={variant}
          onClick={(e) => {
            onClick?.(e);
            setTheme(nextTheme);
          }}
          {...props}
        >
          <Icon />
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        align={align}
        className="flex flex-col items-center gap-2"
      >
        <span>Toggle Theme</span>
        <KbdGroup>
          <Kbd>Alt</Kbd>
          <span>+</span>
          <Kbd>T</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  if (!isMounted) return <LoadingFallback />;

  return (
    <RadioGroup
      value={theme}
      defaultValue="system"
      onValueChange={setTheme}
      className="grid grid-cols-3"
      required
    >
      {Object.entries(themeMeta).map(([k, { icon: Icon }]) => (
        <FieldLabel key={k} htmlFor={`rd-theme-${k}`}>
          <Field>
            <FieldContent className="items-center">
              <FieldTitle className="flex-col capitalize md:flex-row">
                <Icon /> {k}
              </FieldTitle>
            </FieldContent>
            <RadioGroupItem id={`rd-theme-${k}`} value={k} hidden />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}

"use client";

import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { LayoutMode, layoutModeMeta, useLayout } from "@/core/providers/layout";
import { cn } from "@/core/utils/helpers";
import { ComponentProps, useEffect, useEffectEvent } from "react";
import { Button, ButtonProps } from "./button";
import { LoadingFallback } from "./fallback";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./field";
import { Kbd, KbdGroup } from "./kbd";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function LayoutToggle({
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  className,
  disabled,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<ComponentProps<typeof TooltipContent>, "align">) {
  const isMounted = useIsMounted();
  const { layout, setLayout } = useLayout();

  const { icon: Icon } = layoutModeMeta[layout];

  const toggleLayout = () =>
    setLayout((prev) => (prev === "fullwidth" ? "centered" : "fullwidth"));
  const onLayout = useEffectEvent(() => toggleLayout());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "l") {
        e.preventDefault();
        onLayout();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!isMounted) {
    const { icon: UnsetIcon } = layoutModeMeta.unset;
    return (
      <Button size={size} variant={variant} disabled>
        <UnsetIcon />
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
            toggleLayout();
          }}
          className={cn("hidden md:inline-flex", className)}
          disabled={disabled ?? layout === "unset"}
          {...props}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        align={align}
        className="flex flex-col items-center gap-2"
      >
        <span>Toggle Layout</span>
        <KbdGroup>
          <Kbd>Alt</Kbd>
          <span>+</span>
          <Kbd>L</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}

export function LayoutSettings() {
  const isMounted = useIsMounted();
  const { layout, setLayout } = useLayout();

  if (!isMounted) return <LoadingFallback />;

  return (
    <RadioGroup
      value={layout}
      defaultValue="default"
      onValueChange={(v) => setLayout(v as LayoutMode)}
      className="grid grid-cols-2"
      required
    >
      {Object.entries(layoutModeMeta)
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

"use client";

import { messages } from "@/core/constants";
import { defaultLayout, LayoutMode, useLayout } from "@/core/providers";
import { cn, delay } from "@/core/utils";
import {
  ArrowUp,
  Check,
  Copy,
  Frame,
  Minimize,
  Monitor,
  Moon,
  RefreshCcw,
  Scan,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useEffectEvent, useState } from "react";
import { Button, ButtonProps } from "./button";
import { LoadingFallback } from "./fallback";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./field";
import { Kbd, KbdGroup } from "./kbd";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { LoadingSpinner } from "./spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type ButtonPropsWithoutChildren = Omit<ButtonProps, "children">;
type ButtonIconSize = "icon-xs" | "icon-sm" | "icon" | "icon-lg";

export function ThemeButton({
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  ...props
}: ButtonPropsWithoutChildren &
  Pick<ComponentProps<typeof TooltipContent>, "align">) {
  const { setTheme } = useTheme();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={size}
          variant={variant}
          onClick={(e) => {
            onClick?.(e);
            setTheme((prev) => (prev === "dark" ? "light" : "dark"));
          }}
          {...props}
        >
          <Sun className="flex dark:hidden" />
          <Moon className="hidden dark:flex" />
          <span className="sr-only">Toggle theme</span>
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
  const [isMounted, setIsMounted] = useState(false);

  const data = [
    { name: "Light", value: "light", icon: Sun },
    { name: "System", value: "system", icon: Monitor },
    { name: "Dark", value: "dark", icon: Moon },
  ];

  const onMount = useEffectEvent(() => setIsMounted(true));
  useEffect(() => onMount(), []);

  if (!isMounted) return <LoadingFallback />;

  return (
    <RadioGroup
      value={theme}
      defaultValue="system"
      onValueChange={setTheme}
      className="grid grid-cols-3"
      required
    >
      {data.map(({ name, value, icon: Icon }) => (
        <FieldLabel key={value} htmlFor={`rd-theme-${value}`}>
          <Field>
            <FieldContent className="items-center">
              <FieldTitle className="flex-col md:flex-row">
                <Icon /> {name}
              </FieldTitle>
            </FieldContent>
            <RadioGroupItem id={`rd-theme-${value}`} value={value} hidden />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}

export function LayoutButton({
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  className,
  disabled,
  ...props
}: ButtonPropsWithoutChildren &
  Pick<ComponentProps<typeof TooltipContent>, "align">) {
  const { layout, setLayout } = useLayout();
  const LayoutIcon = !layout
    ? Frame
    : { fullwidth: Scan, centered: Minimize }[layout];

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
          disabled={disabled ?? !layout}
          {...props}
        >
          <LayoutIcon />
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
  const { layout, setLayout } = useLayout();
  const [isMounted, setIsMounted] = useState(false);

  const data = [
    { name: "Fullwidth", value: "fullwidth", icon: Scan },
    { name: "Centered", value: "centered", icon: Minimize },
  ];

  const onMount = useEffectEvent(() => setIsMounted(true));
  useEffect(() => onMount(), []);

  if (!isMounted) return <LoadingFallback />;

  return (
    <RadioGroup
      value={layout}
      defaultValue={defaultLayout}
      onValueChange={(v) => setLayout(v as LayoutMode)}
      className="grid grid-cols-2"
      required
    >
      {data.map(({ name, value, icon: Icon }) => (
        <FieldLabel key={value} htmlFor={`rd-theme-${value}`}>
          <Field>
            <FieldContent className="items-center">
              <FieldTitle className="flex-col md:flex-row">
                <Icon /> {name}
              </FieldTitle>
            </FieldContent>
            <RadioGroupItem id={`rd-theme-${value}`} value={value} hidden />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}

export function CopyButton({
  value,
  size = "icon",
  disabled,
  onClick,
  ...props
}: Omit<ButtonPropsWithoutChildren, "value" | "size"> & {
  value: string;
  size?: ButtonIconSize;
}) {
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <Button
      size={size}
      disabled={copied || disabled}
      onClick={async (e) => {
        onClick?.(e);
        setCopied(true);
        navigator.clipboard.writeText(value);
        await delay(1);
        setCopied(false);
      }}
      {...props}
    >
      <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
      <Copy className={cn("transition", copied ? "scale-0" : "scale-100")} />
      <Check
        className={cn("absolute transition", copied ? "scale-100" : "scale-0")}
      />
    </Button>
  );
}

export function RefreshButton({
  text = messages.actions.refresh,
  disabled,
  onClick,
  ...props
}: ButtonPropsWithoutChildren & { text?: string }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <Button
      disabled={refreshing || disabled}
      onClick={async (e) => {
        onClick?.(e);
        setRefreshing(true);
        await delay(0.5);
        router.refresh();
        setRefreshing(false);
      }}
      {...props}
    >
      <LoadingSpinner
        variant="refresh"
        loading={refreshing}
        className="animate-reverse"
        icon={{ base: <RefreshCcw /> }}
      />
      {text}
    </Button>
  );
}

export function ScrollToTopButton({
  size = "icon-lg",
  className,
  onClick,
  ...props
}: ButtonPropsWithoutChildren) {
  return (
    <Button
      size={size}
      className={cn(
        "fixed right-4 bottom-4 z-40 rounded-full lg:right-10 lg:bottom-8",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        window.scrollTo(0, 0);
      }}
      {...props}
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}

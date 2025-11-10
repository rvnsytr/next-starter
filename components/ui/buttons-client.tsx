"use client";

import { actions } from "@/lib/content";
import { useLayout } from "@/providers/layout";
import { cn, delay } from "@/utils";
import {
  ArrowUp,
  Check,
  Copy,
  Frame,
  Minimize,
  Moon,
  RefreshCcw,
  Scan,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useEffectEvent, useState } from "react";
import { Button, ButtonProps } from "./button";
import { Kbd } from "./kbd";
import { LoadingSpinner, LoadingSpinnerProps } from "./spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type ButtonPropsWithoutChildren = Omit<ButtonProps, "children">;
type ButtonIconSize = "icon-xs" | "icon-sm" | "icon" | "icon-lg";

export function LinkSpinner({
  ...props
}: Omit<LoadingSpinnerProps, "loading">) {
  const { pending } = useLinkStatus();
  return <LoadingSpinner loading={pending} {...props} />;
}

export function ThemeButton({
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  ...props
}: ButtonPropsWithoutChildren &
  Pick<ComponentProps<typeof TooltipContent>, "align">) {
  const { setTheme } = useTheme();

  const onTheme = useEffectEvent(() =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark")),
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        onTheme();
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
        <div className="flex items-center gap-x-2">
          <Kbd>Alt</Kbd>
          <span>+</span>
          <Kbd>T</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
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
          disabled={disabled || !layout}
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
        <div className="flex items-center gap-x-2">
          <Kbd>Alt</Kbd>
          <span>+</span>
          <Kbd>L</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
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
  text = actions.refresh,
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

"use client";

import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { cn } from "@/core/utils";
import { FrameIcon, LucideIcon, MinimizeIcon, ScanIcon } from "lucide-react";
import {
  ComponentProps,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import z from "zod";
import { Button, ButtonProps } from "./button";
import { LoadingFallback } from "./fallback";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./field";
import { Kbd, KbdGroup } from "./kbd";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const allLayoutMode = ["fullwidth", "centered", "unset"] as const;
export type LayoutMode = (typeof allLayoutMode)[number];

export const defaultLayout: LayoutMode = "centered";

export const layoutModeMeta: Record<
  LayoutMode,
  { displayName: string; icon: LucideIcon }
> = {
  fullwidth: { displayName: "Fullwidth", icon: ScanIcon },
  centered: { displayName: "Centered", icon: MinimizeIcon },
  unset: { displayName: "Unset", icon: FrameIcon },
};

type LayoutContextType = {
  layout: LayoutMode;
  setLayout: Dispatch<SetStateAction<LayoutMode>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState<LayoutMode>("unset");

  const onMount = useEffectEvent(() => {
    const stored = localStorage.getItem("layout-preference");
    const zodRes = z.enum(allLayoutMode).safeParse(stored);
    if (zodRes.success && zodRes.data !== "unset") setLayout(zodRes.data);
    else {
      setLayout(defaultLayout);
      localStorage.setItem("layout-preference", defaultLayout);
    }
  });

  useEffect(() => onMount(), []);

  useEffect(() => {
    if (layout !== "unset") localStorage.setItem("layout-preference", layout);
  }, [layout]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      <div
        data-layout-mode={layout}
        className="group/layout-mode flex flex-1 flex-col"
      >
        {children}
      </div>
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used in LayoutProvider");
  return ctx;
}

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
  const { layout, setLayout } = useLayout();
  const isMounted = useIsMounted();

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
  const { layout, setLayout } = useLayout();
  const isMounted = useIsMounted();

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

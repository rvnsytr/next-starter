import { cn } from "@/core/utils";
import { Button, ButtonProps } from "./button";

export function PulsatingButton({
  pulseColor = "var(--primary-pulse)",
  duration = "1.5s",
  ...props
}: ButtonProps & { pulseColor?: string; duration?: string }) {
  return (
    <Button
      data-slot="pulsating-button"
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export function PulsatingButtonContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pulsating-button-content"
      className={cn("relative z-10 flex items-center gap-x-2", className)}
      {...props}
    />
  );
}

export function PulsatingButtonPulse({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pulsating-button-pulse"
      className={cn(
        "animate-button-pulse absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-md bg-inherit",
        className,
      )}
      {...props}
    />
  );
}

import { messages } from "@/core/constants";
import { cn } from "@/core/utils";
import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button, ButtonProps, ButtonPropsWithoutChildren } from "./button";

type PulsatingButtonProps = ButtonProps & {
  pulseColor?: string;
  duration?: string;
};

export function ResetButton({
  type = "reset",
  size = "default",
  variant = "outline",
  ...props
}: ButtonPropsWithoutChildren) {
  return (
    <Button type={type} size={size} variant={variant} {...props}>
      <RotateCcw /> {messages.actions.reset}
    </Button>
  );
}

export function PulsatingButton({
  href,
  className,
  children,
  pulseColor = "var(--primary-pulse)",
  duration = "1.5s",
  ...props
}: Omit<PulsatingButtonProps, "asChild"> & { href: string }) {
  return (
    <Button
      className={cn("relative", className)}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      asChild
      {...props}
    >
      <Link href={href}>
        <div className="relative z-10 flex items-center gap-x-2">
          {children}
        </div>
        <div className="animate-button-pulse absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-inherit" />
      </Link>
    </Button>
  );
}

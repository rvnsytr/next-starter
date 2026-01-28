"use client";

import { cn } from "@/core/utils/helpers";
import { motion, useInView, UseInViewOptions } from "motion/react";
import { useMemo, useRef } from "react";

export type ShineTextProps = {
  /** Text to display with shimmer effect */
  text: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before starting animation */
  delay?: number;
  /** Whether to repeat the animation */
  repeat?: boolean;
  /** Pause duration between repeats in seconds */
  repeatDelay?: number;
  /** Custom className */
  className?: string;
  /** Whether to start animation when component enters viewport */
  startOnView?: boolean;
  /** Whether to animate only once */
  once?: boolean;
  /** Margin for in-view detection (rootMargin) */
  inViewMargin?: UseInViewOptions["margin"];
  /** Shimmer spread multiplier */
  spread?: number;
  /** Base text color */
  color?: string;
  /** Shimmer gradient color */
  shineColor?: string;

  children?: React.ReactNode;
};

export function ShineText({
  text,
  duration = 1,
  delay = 0,
  repeat = true,
  repeatDelay = 2,
  className,
  startOnView = true,
  once = false,
  inViewMargin,
  spread = 2,
  color,
  shineColor,
  children,
}: ShineTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: inViewMargin });

  // Calculate dynamic spread based on text length
  const dynamicSpread = useMemo(() => text.length * spread, [text, spread]);

  // Determine if we should start animation
  const shouldAnimate = !startOnView || isInView;

  return (
    <motion.span
      ref={ref}
      className={cn(
        "relative inline-block bg-size-[250%_100%,auto] bg-clip-text text-transparent",
        "[--base-color:var(--foreground)] [--shimmer-color:var(--color-white)]",
        "[background-repeat:no-repeat,padding-box]",
        "[--shimmer-bg:linear-gradient(90deg,transparent_calc(50%-var(--spread)),var(--shimmer-color),transparent_calc(50%+var(--spread)))]",
        className,
      )}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          ...(color && { "--base-color": color }),
          ...(shineColor && { "--shimmer-color": shineColor }),
          backgroundImage: `var(--shimmer-bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
      initial={{ backgroundPosition: "100% center", opacity: 0 }}
      animate={
        shouldAnimate ? { backgroundPosition: "0% center", opacity: 1 } : {}
      }
      transition={{
        backgroundPosition: {
          repeat: repeat ? Infinity : 0,
          duration,
          delay,
          repeatDelay,
          ease: "linear",
        },
        opacity: { duration: 0.3, delay },
      }}
    >
      {children ?? text}
    </motion.span>
  );
}

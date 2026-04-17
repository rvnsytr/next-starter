"use client";

import { cn } from "@/core/utils";
import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef } from "react";

export function BoxReveal({
  boxColor = "var(--primary)",
  duration = 0.5,
  delay = 0,
  className,
  classNames,
  children,
}: {
  boxColor?: string;
  duration?: number;
  delay?: number;
  className?: string;
  classNames?: { children?: string; box?: string };
  children: React.ReactNode;
}) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start("visible");
      mainControls.start("visible");
    } else {
      slideControls.start("hidden");
      mainControls.start("hidden");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} className={cn("relative w-fit overflow-hidden", className)}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay: delay + 0.25 }}
        className={classNames?.children}
      >
        {children}
      </motion.div>

      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: "100%" } }}
        initial="hidden"
        animate={slideControls}
        transition={{
          duration: duration ? duration : 0.5,
          ease: "easeIn",
          delay,
        }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor,
        }}
        className={classNames?.box}
      />
    </div>
  );
}

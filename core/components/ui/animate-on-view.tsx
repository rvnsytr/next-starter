import { motion } from "motion/react";

export function AnimateOnView({
  as = "div",
  initial,
  delay = 0.25,
  duration = 0.5,
  className,
  children,
}: {
  as?: React.HTMLElementType;
  initial?: { x?: number; y?: number };
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const Comp = motion[as];
  return (
    <Comp
      viewport={{ once: true }}
      initial={{ opacity: 0, x: initial?.x ?? 0, y: initial?.y ?? 25 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ ease: "easeOut", delay: delay, duration }}
      className={className}
    >
      {children}
    </Comp>
  );
}

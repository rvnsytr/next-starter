"use client";

import { useCallback, useRef, useState } from "react";

export function useViewTransition() {
  const activeCount = useRef(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback((callback: () => void) => {
    if (!document.startViewTransition) return callback();

    const transition = document.startViewTransition(() => {
      activeCount.current++;
      setIsTransitioning(true);
      callback();
    });

    transition.finished.finally(() => {
      activeCount.current--;
      if (activeCount.current === 0) setIsTransitioning(false);
    });
  }, []);

  return { isTransitioning, startTransition };
}

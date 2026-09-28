"use client";

import { useCallback, useRef, useState } from "react";

export function useViewTransition() {
  const activeCount = useRef(0);
  const [isTransitioning, startTransitioning] = useState(false);

  const startTransition = useCallback((callback: () => void) => {
    const transition = document.startViewTransition(() => {
      activeCount.current++;
      startTransitioning(true);
      callback();
    });

    transition.finished.finally(() => {
      activeCount.current--;
      if (activeCount.current === 0) startTransitioning(false);
    });
  }, []);

  return { isTransitioning, startTransition };
}

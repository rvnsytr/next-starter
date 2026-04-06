"use client";

import { useEffect, useRef, useState } from "react";

export function useCopyToClipboard(config?: {
  timeout?: number;
  onCopy?: () => void;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const copy = (value: string): void => {
    if (
      typeof window === "undefined" ||
      !navigator?.clipboard.writeText ||
      !value
    )
      return;

    navigator.clipboard.writeText(value).then(() => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

      setIsCopied(true);
      config?.onCopy?.();

      if (config?.timeout !== 0) {
        timeoutIdRef.current = setTimeout(() => {
          setIsCopied(false);
          timeoutIdRef.current = null;
        }, config?.timeout ?? 1000);
      }
    }, console.error);
  };

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return { copy, isCopied };
}

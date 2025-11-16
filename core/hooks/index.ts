import { useEffect, useEffectEvent, useState } from "react";

const MOBILE_BREAKPOINT = 768;
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const onMobile = useEffectEvent(() =>
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT),
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    onMobile();
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export * from "./swr";

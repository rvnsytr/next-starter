import { useEffect, useEffectEvent, useState } from "react";

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  const onMount = useEffectEvent(() => setIsMounted(true));
  useEffect(() => onMount(), []);
  return isMounted;
}

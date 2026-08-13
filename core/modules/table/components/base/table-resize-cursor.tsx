import { useEffect } from "react";

export function TableResizeCursor({ resizing }: { resizing: boolean }) {
  useEffect(() => {
    document.body.style.cursor = resizing ? "col-resize" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [resizing]);

  return null;
}

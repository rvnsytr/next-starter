import { RotateCcwIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";

export function ResetButton({
  type = "reset",
  children,
  ...props
}: ButtonProps) {
  return (
    <Button data-slot="reset-button" type={type} {...props}>
      {children ?? (
        <>
          <RotateCcwIcon /> Reset
        </>
      )}
    </Button>
  );
}

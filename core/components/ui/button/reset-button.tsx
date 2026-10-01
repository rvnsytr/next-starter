import { RotateCcwIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";

export function ResetButton({
  type = "reset",
  variant = "outline",
  children,
  ...props
}: ButtonProps) {
  return (
    <Button data-slot="reset-button" type={type} variant={variant} {...props}>
      {children ?? (
        <>
          <RotateCcwIcon /> Reset
        </>
      )}
    </Button>
  );
}

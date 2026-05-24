import { messages } from "@/core/messages";
import { RotateCcwIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";

export function ResetButton({
  type = "reset",
  size = "default",
  variant = "outline",
  children,
  ...props
}: ButtonProps) {
  const isIconSize = size?.startsWith("icon");
  return (
    <Button
      data-slot="reset-button"
      type={type}
      size={size}
      variant={variant}
      {...props}
    >
      {children ?? (
        <>
          <RotateCcwIcon />
          {!isIconSize && messages.actions.reset}
        </>
      )}
    </Button>
  );
}

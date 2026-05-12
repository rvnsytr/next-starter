import { messages } from "@/core/messages";
import { RotateCcwIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";

export function ResetButton({
  type = "reset",
  size = "default",
  variant = "outline",
  ...props
}: Omit<ButtonProps, "children">) {
  return (
    <Button
      data-slot="reset-button"
      type={type}
      size={size}
      variant={variant}
      {...props}
    >
      <RotateCcwIcon />
      {!size?.startsWith("icon") && messages.actions.reset}
    </Button>
  );
}

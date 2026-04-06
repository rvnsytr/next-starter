import { messages } from "@/core/constants/messages";
import { RotateCcwIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";

export function ResetButton({
  type = "reset",
  variant = "outline",
  ...props
}: Omit<ButtonProps, "children">) {
  return (
    <Button data-slot="reset-button" type={type} variant={variant} {...props}>
      <RotateCcwIcon /> {messages.actions.reset}
    </Button>
  );
}

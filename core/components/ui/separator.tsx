import { cn } from "@/core/utils/helpers";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        className,
      )}
      {...props}
    />
  );
}

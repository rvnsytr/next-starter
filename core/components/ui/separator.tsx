import { cn } from "@/core/utils/helpers";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:h-full data-vertical:w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };

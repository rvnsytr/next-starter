import { Button, ButtonProps } from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { FilterXIcon } from "lucide-react";

export type ClearFiltersProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

type ClearFiltersContext = {
  onClear: () => void;
};

export function ClearFilters({
  context,
  align,
  size = "sm",
  variant = "destructive-outline",
  onClick,
  children,
  ...props
}: ClearFiltersProps & { context: ClearFiltersContext }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={size}
            variant={variant}
            onClick={(e) => {
              context.onClear();
              onClick?.(e);
            }}
            {...props}
          >
            {children ?? (
              <>
                <FilterXIcon /> Clear
              </>
            )}
          </Button>
        }
      />
      <TooltipPopup align={align}>Clear All Filters</TooltipPopup>
    </Tooltip>
  );
}

import { Checkbox } from "@/core/components/ui/checkbox";
import { cn } from "@/core/utils";

type BaseSelectAllCheckboxProps = React.ComponentProps<typeof Checkbox>;

export type SelectAllCheckboxProps = Omit<
  BaseSelectAllCheckboxProps,
  "checked" | "onCheckedChange" | "indeterminate"
>;

export function SelectAllCheckbox({
  className,
  ...props
}: BaseSelectAllCheckboxProps) {
  return (
    <Checkbox
      aria-label="Select all"
      className={cn("mx-auto", className)}
      {...props}
    />
  );
}

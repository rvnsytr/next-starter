import { Checkbox } from "@/core/components/ui/checkbox";
import { cn } from "@/core/utils";

type CheckboxProps = React.ComponentProps<typeof Checkbox>;

type BaseSelectRowCheckboxProps = CheckboxProps &
  Required<Pick<CheckboxProps, "checked" | "onCheckedChange" | "disabled">>;

export type SelectRowCheckboxProps = Omit<
  CheckboxProps,
  "checked" | "onCheckedChange"
>;

export function SelectRowCheckbox({
  className,
  ...props
}: BaseSelectRowCheckboxProps) {
  return (
    <Checkbox
      aria-label="Select row"
      className={cn("mx-auto", className)}
      {...props}
    />
  );
}

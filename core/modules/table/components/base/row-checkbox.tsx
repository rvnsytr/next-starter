import { Checkbox } from "@/core/components/ui/checkbox";
import { cn } from "@/core/utils";

type CheckboxProps = React.ComponentProps<typeof Checkbox>;

type BaseRowCheckboxProps = CheckboxProps &
  Required<Pick<CheckboxProps, "checked" | "onCheckedChange" | "disabled">>;

export type RowCheckboxProps = Omit<
  CheckboxProps,
  "checked" | "onCheckedChange"
>;

export function RowCheckbox({ className, ...props }: BaseRowCheckboxProps) {
  return (
    <Checkbox
      aria-label="Select row"
      className={cn("mx-auto", className)}
      {...props}
    />
  );
}

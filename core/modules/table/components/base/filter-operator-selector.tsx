import { Button, ButtonProps } from "@/core/components/ui/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/core/components/ui/menu";
import { getFilterOperators } from "@/core/modules/table/operators";
import { ColumnFilterContext, Filter } from "@/core/modules/table/types";
import { useMemo } from "react";

type FilterOperatorSelectorProps = ButtonProps & {
  context: ColumnFilterContext;
  align?: React.ComponentProps<typeof MenuPopup>["align"];
};

export function FilterOperatorSelector({
  context,
  size = "sm",
  variant = "outline",
  align = "center",
  ...props
}: FilterOperatorSelectorProps) {
  // const [operator, setOperator] = useState(context.filter.operator);

  const operators = useMemo(
    () => getFilterOperators(context.filter.type),
    [context.filter.type],
  );

  const selectedOperatorLabel = useMemo(() => {
    const operator = context.filter.operator;
    const selected = operators.find((op) => op.value === operator);
    return selected?.label ?? operator;
  }, [context.filter.operator, operators]);

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button size={size} variant={variant} {...props}>
            {selectedOperatorLabel}
          </Button>
        }
      />

      <MenuPopup align={align}>
        {operators.map((op) => (
          <MenuItem
            key={op.value}
            onClick={() => {
              context.setFilter({
                ...context.filter,
                operator: op.value,
              } as Filter);
            }}
          >
            {op.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  );
}

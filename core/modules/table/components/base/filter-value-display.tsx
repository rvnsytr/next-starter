import { Button, ButtonProps } from "@/core/components/ui/button";
import { Menu, MenuPopup, MenuTrigger } from "@/core/components/ui/menu";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { EMPTY_FILTER_OPERATOR_VALUES } from "@/core/modules/table/operators";
import {
  ColumnFilterContext,
  Filter,
  FilterType,
} from "@/core/modules/table/types";
import { formatNumber } from "@/core/utils";
import { format } from "date-fns";
import { EllipsisIcon } from "lucide-react";

export type FilterValueDisplayPopupProps = ButtonProps & {
  context: ColumnFilterContext;
};

export function FilterValueDisplayPopup({
  context,
  children,
  ...props
}: FilterValueDisplayPopupProps) {
  if (EMPTY_FILTER_OPERATOR_VALUES.some((v) => v === context.filter.operator))
    return null;

  const trigger = (
    <Button {...props}>
      <FilterValueDisplay filter={context.filter} />
    </Button>
  );

  if (context.popupType === "menu")
    return (
      <Menu>
        <MenuTrigger render={trigger} />
        <MenuPopup>{children}</MenuPopup>
      </Menu>
    );

  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverPopup className="w-fit max-w-3xs rounded-xl *:p-1">
        {children}
      </PopoverPopup>
    </Popover>
  );
}

export type FilterValueDisplayProps<T extends FilterType> = Extract<
  Filter,
  { type: T }
>;

export function FilterValueDisplay({ filter }: { filter: Filter }) {
  const filterType = filter.type;
  switch (filterType) {
    case "string":
      return <FilterValueDisplayString {...filter} />;
    case "number":
      return <FilterValueDisplayNumber {...filter} />;
    case "boolean":
      return <FilterValueDisplayBoolean {...filter} />;
    case "option":
    case "multi-option":
      return <FilterValueDisplayOptions {...filter} />;
    case "date-time":
    case "date":
    case "time":
      return <FilterValueDisplayTemporal {...filter} />;
    default:
      return `Filter type "${filterType}" is not supported.`;
  }
}

function FilterValueDisplayString({
  value,
}: FilterValueDisplayProps<"string">) {
  const maxStringLength = 20;
  const displayValue =
    value.length > maxStringLength
      ? `${value.slice(0, maxStringLength)}...`
      : value;
  return !!displayValue ? displayValue : <EllipsisIcon />;
}

function FilterValueDisplayNumber({
  operator,
  value,
}: FilterValueDisplayProps<"number">) {
  const [start, end] = value;
  if (!start) return <EllipsisIcon />;

  if (operator.includes("between") && !!end)
    return `${formatNumber(start)} - ${formatNumber(end)}`;

  return `${formatNumber(start)}`;
}

function FilterValueDisplayBoolean({
  value,
}: FilterValueDisplayProps<"boolean">) {
  return String(value);
}

function FilterValueDisplayOptions({
  value,
}: FilterValueDisplayProps<"option" | "multi-option">) {
  if (value.length === 0) return <EllipsisIcon />;
  if (value.length > 2)
    return value.slice(0, 2).join(", ") + `, and ${value.length - 2} more`;
  return value.join(", ");
}

function FilterValueDisplayTemporal({
  type,
  operator,
  value,
}: FilterValueDisplayProps<"date-time" | "date" | "time">) {
  const [start, end] = value;
  if (!start) return <EllipsisIcon />;

  let formatStr = "PPP";
  if (type === "date-time" && operator === "exactly") formatStr = "PPPp";
  if (type === "time") formatStr = "p";

  if (operator.includes("between") && !!end)
    return `${format(start, formatStr)} - ${format(end, formatStr)}`;

  return format(start, formatStr);
}

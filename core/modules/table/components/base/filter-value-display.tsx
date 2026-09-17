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
      <FilterValueDisplay context={context} />
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

export type FilterValueDisplayProps<T extends FilterType> = {
  context: Pick<ColumnFilterContext, "columnMeta"> & {
    filter: Extract<Filter, { type: T }>;
  };
};

export function FilterValueDisplay({
  context,
}: {
  context: ColumnFilterContext;
}) {
  const { filter, columnMeta } = context;
  const filterType = filter.type;

  switch (filterType) {
    case "string":
      return <FilterValueDisplayString context={{ filter, columnMeta }} />;

    case "number":
      return <FilterValueDisplayNumber context={{ filter, columnMeta }} />;

    case "boolean":
      return <FilterValueDisplayBoolean context={{ filter, columnMeta }} />;

    case "option":
    case "multi-option":
      return <FilterValueDisplayOptions context={{ filter, columnMeta }} />;

    case "date-time":
    case "date":
    case "time":
      return <FilterValueDisplayTemporal context={{ filter, columnMeta }} />;

    default:
      return `Filter type "${filterType}" is not supported.`;
  }
}

const MAX_STRING_LENGTH = 20;
function FilterValueDisplayString({
  context,
}: FilterValueDisplayProps<"string">) {
  const { value } = context.filter;

  const displayValue =
    value.length > MAX_STRING_LENGTH
      ? `${value.slice(0, MAX_STRING_LENGTH)}...`
      : value;

  return !!displayValue ? displayValue : <EllipsisIcon />;
}

function FilterValueDisplayNumber({
  context,
}: FilterValueDisplayProps<"number">) {
  const { operator, value } = context.filter;

  const [start, end] = value;
  if (!start) return <EllipsisIcon />;

  if (operator.includes("between") && !!end)
    return `${formatNumber(start)} - ${formatNumber(end)}`;

  return `${formatNumber(start)}`;
}

function FilterValueDisplayBoolean({
  context,
}: FilterValueDisplayProps<"boolean">) {
  const { filter, columnMeta } = context;

  if (columnMeta?.booleanLabels)
    return columnMeta.booleanLabels[filter.value ? "true" : "false"];

  return String(filter.value);
}

function FilterValueDisplayOptions({
  context,
}: FilterValueDisplayProps<"option" | "multi-option">) {
  const { value } = context.filter;

  if (!value.length) return <EllipsisIcon />;

  if (value.length > 2)
    return value.slice(0, 2).join(", ") + `, and ${value.length - 2} more`;

  return value.join(", ");
}

function FilterValueDisplayTemporal({
  context,
}: FilterValueDisplayProps<"date-time" | "date" | "time">) {
  const { type, operator, value } = context.filter;

  const [start, end] = value;
  if (!start) return <EllipsisIcon />;

  let formatStr = "PPP";
  if (type === "date-time" && operator === "exactly") formatStr = "PPPp";
  if (type === "time") formatStr = "p";

  if (operator.includes("between") && !!end)
    return `${format(start, formatStr)} - ${format(end, formatStr)}`;

  return format(start, formatStr);
}

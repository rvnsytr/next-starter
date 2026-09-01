import { Button, ButtonProps } from "@/core/components/ui/button";
import { ButtonGroup } from "@/core/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Kbd } from "@/core/components/ui/kbd";
import { Label } from "@/core/components/ui/label";
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuPopup,
  MenuShortcut,
  MenuTrigger,
} from "@/core/components/ui/menu";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/core/components/ui/number-field";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { Slider } from "@/core/components/ui/slider";
import { Switch } from "@/core/components/ui/switch";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/core/components/ui/tabs";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { useDebounce } from "@/core/hooks/use-debounce";
import {
  filterMeta,
  FilterPopupType,
  FilterType,
  FilterValue,
  getFilterOperators,
} from "@/core/modules/table/filters";
import { ColumnMeta } from "@/core/modules/table/types";
import { cn, formatNumber } from "@/core/utils";
import { ErrorFallback } from "@/shared/components/fallback";
import { languages } from "@/shared/constants";
import {
  formatForDisplay,
  HotkeySequence,
  useHotkeySequence,
} from "@tanstack/react-hotkeys";
import {
  ChevronRightIcon,
  EllipsisIcon,
  FilterIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type FilterSelectorProps = Omit<ButtonProps, "children"> & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /**
   * Keyboard shortcut used to open the filter selector.
   * If set to "default", the default shortcut (F) is used.
   */
  shortcut?: "default" | HotkeySequence;

  renderTrigger?: React.ReactElement;
};

type FilterValueControllerProps = {
  columnId: string;
  popupType: FilterPopupType;
  filterValue: FilterValue;
  setFilter: (updater: FilterValue | undefined) => void;
  columnMeta?: ColumnMeta;
};

type FilterColumnContext =
  | ({ success: true } & FilterValueControllerProps)
  | {
      success: false;
      id: string;
      type: "column" | "validation";
      message?: string;
      error?: unknown;
    };

type FilterSelectorContext = {
  columnFilterIds: Set<string>;
  columns: FilterColumnContext[];
};

const DEFAULT_SHORTCUT: HotkeySequence = ["F"];
const ANIMATION_DELAY = 50;

export function FilterSelector({
  context,
  align = "center",
  shortcut,
  renderTrigger,
  size = "default",
  variant = "outline",
  ...props
}: FilterSelectorProps & { context: FilterSelectorContext }) {
  const anchor = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterValueController, setFilterValueController] =
    useState<FilterValueControllerProps | null>(null);

  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkeySequence(
    hotkeySequence ?? DEFAULT_SHORTCUT,
    () => setIsOpen((prev) => !prev),
    { enabled: !!hotkeySequence },
  );

  return (
    <>
      <Menu
        open={isOpen}
        onOpenChange={(v) => {
          setIsOpen(v);
          if (v) return;
          setTimeout(() => setFilterValueController(null), ANIMATION_DELAY);
        }}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <MenuTrigger
                ref={anchor}
                render={
                  renderTrigger ?? (
                    <Button size={size} variant={variant} {...props}>
                      <FilterIcon /> Filter
                    </Button>
                  )
                }
              />
            }
          />

          <TooltipPopup align={align}>
            Filter Columns
            {hotkeySequence && (
              <Kbd className="ml-1">
                {hotkeySequence.map((k) => formatForDisplay(k)).join("+")}
              </Kbd>
            )}
          </TooltipPopup>
        </Tooltip>

        <MenuPopup align={align}>
          {filterValueController?.popupType === "menu" ? (
            <FilterValueController {...filterValueController} />
          ) : (
            context.columns.map((c) => {
              if (!c.success) {
                let errorContent = "";

                if (c.type === "column")
                  errorContent = c.message ?? `Invalid Column Id: ${c.id}`;
                if (c.type === "validation")
                  errorContent =
                    c.message ?? `Invalid Filter Value for Column: ${c.id}`;

                return (
                  <MenuItem key={c.id} disabled>
                    {errorContent}
                  </MenuItem>
                );
              }

              const Icon = c.columnMeta?.icon;
              return (
                <MenuItem
                  key={c.columnId}
                  onClick={() => {
                    if (c.popupType === "popover") setIsOpen(false);
                    setTimeout(
                      () => setFilterValueController(c),
                      ANIMATION_DELAY,
                    );
                  }}
                  disabled={context.columnFilterIds.has(c.columnId)}
                  closeOnClick={false}
                >
                  {Icon && <Icon className="text-muted-foreground" />}
                  {c.columnMeta?.label ?? c.columnId}
                  <MenuShortcut>
                    <ChevronRightIcon />
                  </MenuShortcut>
                </MenuItem>
              );
            })
          )}
        </MenuPopup>
      </Menu>

      <Popover
        open={filterValueController?.popupType === "popover"}
        onOpenChange={(v) => {
          if (!v) setFilterValueController(null);
        }}
      >
        <PopoverPopup
          anchor={anchor}
          align={align}
          className="max-w-3xs rounded-xl *:p-1"
        >
          {filterValueController ? (
            <FilterValueController {...filterValueController} />
          ) : (
            <ErrorFallback
              error="Invalid Filter Selector State"
              errorOnly
              hideCode
            />
          )}
        </PopoverPopup>
      </Popover>
    </>
  );
}

export function FilterValueControllerErrorFallback({
  filterType: ft,
}: {
  filterType: string;
}) {
  const filterType = ft ?? "unknown";
  return (
    <ErrorFallback
      title="Unsupported Filter Type"
      error={`Filter type "${filterType}" is not supported.`}
      hideCode
      hideErrorDetail
    />
  );
}

function FilterValueController(props: FilterValueControllerProps) {
  const filterType = props.filterValue.type;
  switch (filterType) {
    case "string":
      return <FilterValueControllerString {...props} />;
    case "number":
      return <FilterValueControllerNumber {...props} />;
    case "boolean":
      return <FilterValueControllerBoolean {...props} />;
    case "option":
      return <FilterValueControllerOption {...props} />;
    case "multi-option":
      return "meh";
    default:
      return <FilterValueControllerErrorFallback filterType={filterType} />;
  }
}

function FilterValueControllerString({
  filterValue,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "string";

  const isFilterValueValid = filterValue.type === filterType;
  const defaultValue = isFilterValueValid
    ? filterValue.value
    : filterMeta.string.defaultValue.value;

  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    if (!isFilterValueValid) return;
    setFilter({
      type: filterType,
      operator: filterValue.operator,
      value: debouncedValue,
    });
  }, [isFilterValueValid, setFilter, filterValue.operator, debouncedValue]);

  if (!isFilterValueValid)
    return <FilterValueControllerErrorFallback filterType={filterType} />;

  const { label, icon: Icon } = columnMeta ?? {};

  return (
    <InputGroup>
      <InputGroupInput
        value={value}
        onChange={(e) => setValue(String(e.target.value))}
        placeholder={`Search ${label?.toLowerCase()}...`}
        autoFocus
      />

      {Icon && (
        <InputGroupAddon>
          <Icon />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

function FilterValueControllerNumber({
  filterValue,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "number";
  const metaDefaultValue = filterMeta.number.defaultValue.value;

  const isFilterValueValid = filterValue.type === filterType;
  const defaultValue = isFilterValueValid
    ? filterValue.value
    : metaDefaultValue;

  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value);

  const [tab, setTab] = useState<"single" | "range">(
    defaultValue.length === 2 ? "range" : "single",
  );

  const sliderScale = useMemo(() => {
    const min = columnMeta?.min ?? 0;
    const max = columnMeta?.max ?? 100;

    const maxTicks = 20;
    const range = max - min;

    if (range <= maxTicks) {
      return {
        min,
        max,
        ticks: Array.from({ length: range + 1 }, (_, i) => ({
          value: min + i,
          major: true,
        })),
      };
    }

    const majorInterval = Math.ceil(range / 5);
    const minorInterval = Math.max(1, Math.floor(majorInterval / 5));

    const ticks = [];

    for (let v = min; v <= max; v += minorInterval)
      ticks.push({ value: v, major: (v - min) % majorInterval === 0 });

    if (ticks.at(-1)?.value !== max) ticks.push({ value: max, major: true });

    return { min, max, ticks };
  }, [columnMeta]);

  useEffect(() => {
    if (!isFilterValueValid) return;
    setFilter({
      type: filterType,
      operator: filterValue.operator,
      value: debouncedValue,
    });
  }, [isFilterValueValid, setFilter, filterValue.operator, debouncedValue]);

  if (!isFilterValueValid)
    return <FilterValueControllerErrorFallback filterType={filterType} />;

  const { label } = columnMeta ?? {};

  return (
    <Tabs value={tab} onValueChange={setTab} className="gap-2">
      <TabsList className="w-full">
        <TabsTab value="single">Single</TabsTab>
        <TabsTab value="range">Range</TabsTab>
      </TabsList>

      <TabsPanel value="single">
        <NumberField
          size="sm"
          value={value[0] ?? 0}
          onValueChange={(v) => setValue(() => [v ?? 0])}
          locale={languages.meta.id.locale}
          autoFocus
        >
          <NumberFieldGroup>
            <NumberFieldInput placeholder={`Enter ${label?.toLowerCase()}`} />
            <NumberFieldDecrement />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </TabsPanel>

      <TabsPanel value="range" className="flex flex-col gap-y-2 pt-2">
        <Slider
          min={sliderScale.min}
          max={sliderScale.max}
          value={value}
          onValueChange={(v) => {
            if (typeof v === "number") return setValue([v]);
            setValue([...v]);
          }}
        />

        <div className="text-muted-foreground flex items-center justify-between gap-1 px-1 text-xs">
          {sliderScale.ticks.map((tick, index) => {
            const isFirst = index === 0;
            const isLast = index === sliderScale.ticks.length - 1;
            return (
              <span
                key={tick.value}
                className={cn(
                  "flex w-0 flex-col items-center justify-center gap-1",
                  isFirst && "items-start",
                  isLast && "items-end",
                )}
              >
                <span
                  className={cn(
                    "bg-muted-foreground/72 w-px",
                    tick.major ? "h-1" : "h-0.5",
                  )}
                />

                <span className={cn(!tick.major && "opacity-0")}>
                  {tick.value}
                </span>
              </span>
            );
          })}
        </div>

        <div className="flex gap-2">
          <NumberField
            size="sm"
            min={sliderScale.min}
            max={sliderScale.max}
            value={value[0] ?? 0}
            onValueChange={(v) => setValue((prev) => [v ?? 0, prev[1] ?? 0])}
            locale={languages.meta.id.locale}
            autoFocus
          >
            <NumberFieldGroup>
              <NumberFieldInput placeholder="From" />
              <NumberFieldDecrement />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>

          <NumberField
            size="sm"
            min={sliderScale.min}
            max={sliderScale.max}
            value={value[1] ?? 0}
            onValueChange={(v) => setValue((prev) => [prev[0] ?? 0, v ?? 0])}
            locale={languages.meta.id.locale}
          >
            <NumberFieldGroup>
              <NumberFieldInput placeholder="To" />
              <NumberFieldDecrement />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
        </div>
      </TabsPanel>
    </Tabs>
  );
}

function FilterValueControllerBoolean({
  filterValue,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "boolean";

  const isFilterValueValid = filterValue.type === filterType;
  const defaultValue = isFilterValueValid
    ? filterValue.value
    : filterMeta.boolean.defaultValue.value;

  const [value, setValue] = useState(defaultValue);

  if (!isFilterValueValid)
    return <FilterValueControllerErrorFallback filterType={filterType} />;

  const { label, icon: Icon } = columnMeta ?? {};
  const id = label?.toLocaleLowerCase() ?? crypto.randomUUID();

  return (
    <Label htmlFor={id} className="flex w-fit items-center gap-4 p-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4" />}
        <p>{label ?? "Value"}</p>
      </div>

      <Switch
        id={id}
        checked={value}
        onCheckedChange={(v) => {
          if (!isFilterValueValid) return;
          setValue(v);
          setFilter({
            type: filterType,
            operator: filterValue.operator,
            value: v,
          });
        }}
      />
    </Label>
  );
}

function FilterValueControllerOption({
  filterValue,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "option";

  const isFilterValueValid = filterValue.type === filterType;
  const defaultValue = isFilterValueValid
    ? filterValue.value
    : filterMeta.option.defaultValue.value;

  const [value, setValue] = useState(defaultValue);

  if (!isFilterValueValid)
    return <FilterValueControllerErrorFallback filterType={filterType} />;

  if (!columnMeta?.options || !columnMeta.options.length)
    return (
      <ErrorFallback
        error="No option items provided for this column"
        errorOnly
        hideCode
      />
    );

  return columnMeta.options.map((option) => {
    const isChecked = value.includes(option.value);
    const count = option.count ?? null;
    const Icon = option.icon;
    return (
      <MenuCheckboxItem
        key={option.value}
        checked={isChecked}
        onCheckedChange={(v) => {
          const newValue = v
            ? [...value, option.value]
            : value.filter((val) => val !== option.value);

          setValue(newValue);
          setFilter({
            type: filterType,
            operator: filterValue.operator,
            value: newValue,
          });
        }}
      >
        <div className="flex gap-4">
          <div className="flex gap-2">
            {Icon && <Icon className="text-muted-foreground" />}
            {option.label}
          </div>
          {count && <MenuShortcut>{formatNumber(count)}</MenuShortcut>}
        </div>
      </MenuCheckboxItem>
    );
  });
}

export type ActiveFiltersContainerProps = React.ComponentProps<"div">;

export function ActiveFiltersContainer({
  className,
  ...props
}: ActiveFiltersContainerProps) {
  return (
    <ScrollArea
      className="border-t border-b border-dashed"
      scrollFade
      withScrollbar={false}
    >
      <div
        className={cn("flex items-center gap-2 px-4 py-2", className)}
        {...props}
      />
    </ScrollArea>
  );
}

export type ActiveFiltersProps = React.ComponentProps<typeof ButtonGroup>;

export function ActiveFilters({
  contexts,
  className,
  ...props
}: ActiveFiltersProps & { contexts: FilterColumnContext[] }) {
  return contexts.map((c) => {
    if (!c.success) {
      let errorContent = "";

      if (c.type === "column")
        errorContent = c.message ?? `Invalid Column Id: ${c.id}`;
      if (c.type === "validation")
        errorContent = c.message ?? `Invalid Filter Value for Column: ${c.id}`;

      const button = (
        <Button
          key={c.id}
          size="sm"
          variant="destructive-outline"
          className="disabled:opacity-100"
          disabled
        >
          {errorContent}
        </Button>
      );

      return c.type === "column" ? (
        button
      ) : (
        <Tooltip key={c.id}>
          <TooltipTrigger render={button} />
          <TooltipPopup className="text-destructive">
            <pre>{JSON.stringify(c.error, null, 2)}</pre>
          </TooltipPopup>
        </Tooltip>
      );
    }

    const operators = getFilterOperators(c.filterValue.type);
    const selectedOperatorLabel =
      operators.find((op) => op.value === c.filterValue.operator)?.label ??
      c.filterValue.operator;

    const Icon = c.columnMeta?.icon;

    return (
      <ButtonGroup
        key={c.columnId}
        className={cn("**:text-xs", className)}
        {...props}
      >
        <Button
          size="sm"
          variant="outline"
          className="disabled:opacity-100"
          disabled
        >
          {Icon && <Icon />}
          {c.columnMeta?.label ?? c.columnId}
        </Button>

        <Menu>
          <MenuTrigger
            render={
              <Button size="sm" variant="outline">
                {selectedOperatorLabel}
              </Button>
            }
          />
          <MenuPopup>
            {operators.map((op) => (
              <MenuItem
                key={op.value}
                onClick={() => {
                  c.setFilter({
                    ...c.filterValue,
                    operator: op.value,
                  } as FilterValue);
                }}
              >
                {op.label}
              </MenuItem>
            ))}
          </MenuPopup>
        </Menu>

        <FilterValueDisplayPopup
          size="sm"
          variant="outline"
          filterValue={c.filterValue}
          popupType={c.popupType}
        >
          <FilterValueController {...c} />
        </FilterValueDisplayPopup>

        <Button
          size="icon-sm"
          variant="destructive-outline"
          onClick={() => c.setFilter(undefined)}
        >
          <XIcon />
        </Button>
      </ButtonGroup>
    );
  });
}

type FilterValueDisplayPopupProps = ButtonProps & {
  filterValue: FilterValue;
  popupType: FilterPopupType;
};

function FilterValueDisplayPopup({
  filterValue,
  popupType,
  children,
  ...props
}: FilterValueDisplayPopupProps) {
  const operators = getFilterOperators(filterValue.type);
  const withValue =
    operators.find((v) => v.value === filterValue.operator)?.withValue ?? true;

  if (!withValue) return null;

  const trigger = (
    <Button {...props}>
      <FilterValueDisplay filterValue={filterValue} />
    </Button>
  );

  if (popupType === "menu")
    return (
      <Menu>
        <MenuTrigger render={trigger} />
        <MenuPopup>{children}</MenuPopup>
      </Menu>
    );

  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverPopup className="max-w-3xs rounded-xl *:p-1">
        {children}
      </PopoverPopup>
    </Popover>
  );
}

type FilterValueDisplayProps<T extends FilterType> = Pick<
  Extract<FilterValue, { type: T }>,
  "value"
>;

function FilterValueDisplay({ filterValue }: { filterValue: FilterValue }) {
  const filterType = filterValue.type;
  switch (filterType) {
    case "string":
      return <FilterValueDisplayString value={filterValue.value} />;
    case "number":
      return <FilterValueDisplayNumber value={filterValue.value} />;
    case "boolean":
      return <FilterValueDisplayBoolean value={filterValue.value} />;
    case "option":
      return <FilterValueDisplayOptions value={filterValue.value} />;
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
  value,
}: FilterValueDisplayProps<"number">) {
  if (value.length === 0) return <EllipsisIcon />;
  if (value.length === 1) return `${formatNumber(value[0])}`;
  if (value.length === 2)
    return `${formatNumber(value[0])} - ${formatNumber(value[1])}`;
  return <EllipsisIcon />;
}

function FilterValueDisplayBoolean({
  value,
}: FilterValueDisplayProps<"boolean">) {
  return String(value);
}

function FilterValueDisplayOptions({
  value,
}: FilterValueDisplayProps<"option">) {
  if (value.length === 0) return <EllipsisIcon />;
  if (value.length > 2)
    return value.slice(0, 2).join(", ") + `, and ${value.length - 2} more`;
  return value.join(", ");
}

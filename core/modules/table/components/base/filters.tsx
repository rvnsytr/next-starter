import { Button, ButtonProps } from "@/core/components/ui/button";
import { ButtonGroup } from "@/core/components/ui/button-group";
import { Calendar } from "@/core/components/ui/calendar";
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
  Filter,
  filterMeta,
  FilterPopupType,
  FilterType,
  getFilterOperators,
} from "@/core/modules/table/filters";
import { EMPTY_FILTER_OPERATORS } from "@/core/modules/table/operators";
import { ColumnMeta } from "@/core/modules/table/types";
import { cn, formatNumber } from "@/core/utils";
import { ErrorFallback } from "@/shared/components/fallback";
import { appConfig } from "@/shared/configs";
import {
  formatForDisplay,
  HotkeySequence,
  useHotkeySequence,
} from "@tanstack/react-hotkeys";
import { format } from "date-fns";
import {
  ChevronRightIcon,
  EllipsisIcon,
  FilterIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type FilterValueControllerProps = {
  columnId: string;
  filter: Filter;
  popupType: FilterPopupType;
  setFilter: (updater: Filter | undefined) => void;
  columnMeta?: ColumnMeta;
};

export type FilterColumnContext =
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

export type FilterSelectorProps = Omit<ButtonProps, "children"> & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];

  /**
   * Keyboard shortcut used to open the filter selector.
   * If set to "default", the default shortcut (F) is used.
   */
  shortcut?: "default" | HotkeySequence;

  renderTrigger?: React.ReactElement;
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
  const [filterValueController, setFilterValueController] =
    useState<FilterValueControllerProps | null>(null);

  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkeySequence(
    hotkeySequence ?? DEFAULT_SHORTCUT,
    () => setIsSelectorOpen((prev) => !prev),
    { enabled: !!hotkeySequence },
  );

  return (
    <>
      <Menu open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
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
          {context.columns.map((c) => {
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
                  setIsSelectorOpen(false);

                  if (c.popupType === "menu") setIsMenuOpen(true);
                  if (c.popupType === "popover") setIsPopoverOpen(true);

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
          })}
        </MenuPopup>
      </Menu>

      <Menu
        open={isMenuOpen}
        onOpenChange={(v) => {
          setIsMenuOpen(v);
          if (!v) {
            setIsSelectorOpen(true);
            setTimeout(() => setFilterValueController(null), ANIMATION_DELAY);
          }
        }}
      >
        <MenuPopup anchor={anchor} align={align}>
          {filterValueController ? (
            <FilterValueController {...filterValueController} />
          ) : (
            <ErrorFallback
              error="Invalid Filter Selector State"
              errorOnly
              hideCode
            />
          )}
        </MenuPopup>
      </Menu>

      <Popover
        open={isPopoverOpen}
        onOpenChange={(v) => {
          setIsPopoverOpen(v);
          if (!v) {
            setIsSelectorOpen(true);
            setTimeout(() => setFilterValueController(null), ANIMATION_DELAY);
          }
        }}
      >
        <PopoverPopup
          anchor={anchor}
          align={align}
          className="w-fit max-w-3xs rounded-xl *:p-1"
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
  const filterType = ft || "unknown";
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
  const filterType = props.filter.type;
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
      return <FilterValueControllerMultiOption {...props} />;
    case "date-time":
    case "date":
    case "time":
      return <FilterValueControllerTemporal {...props} />;
    default:
      return <FilterValueControllerErrorFallback filterType={filterType} />;
  }
}

function FilterValueControllerString({
  filter,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "string";

  const isFilterValid = filter.type === filterType;
  const defaultValue = isFilterValid
    ? filter.value
    : filterMeta[filterType].defaultValue.value;

  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    if (!isFilterValid) return;
    setFilter({ ...filter, value: debouncedValue });
  }, [setFilter, isFilterValid, filter, debouncedValue]);

  if (!isFilterValid)
    return <FilterValueControllerErrorFallback filterType={filter.type} />;

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
  filter,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "number";

  const isFilterValid = filter.type === filterType;
  const defaultValue = isFilterValid
    ? filter.value
    : filterMeta[filterType].defaultValue.value;

  const [tab, setTab] = useState<"single" | "range">(
    defaultValue.length === 2 ? "range" : "single",
  );

  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value);

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
    if (!isFilterValid) return;
    setFilter({ ...filter, value: debouncedValue });
  }, [setFilter, isFilterValid, filter, debouncedValue]);

  if (!isFilterValid)
    return <FilterValueControllerErrorFallback filterType={filter.type} />;

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
          locale={appConfig.default.numberLocale}
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
            locale={appConfig.default.numberLocale}
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
            locale={appConfig.default.numberLocale}
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
  filter,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "boolean";

  const isFilterValid = filter.type === filterType;
  const defaultValue = isFilterValid
    ? filter.value
    : filterMeta[filterType].defaultValue.value;

  const [value, setValue] = useState(defaultValue);

  if (!isFilterValid)
    return <FilterValueControllerErrorFallback filterType={filter.type} />;

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
          setValue(v);
          setFilter({ ...filter, value: v });
        }}
        autoFocus
      />
    </Label>
  );
}

function FilterValueControllerOption({
  filter,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "option";

  const isFilterValid = filter.type === filterType;
  const defaultValue = isFilterValid
    ? filter.value
    : filterMeta[filterType].defaultValue.value;

  const [value, setValue] = useState(defaultValue);

  if (!isFilterValid)
    return <FilterValueControllerErrorFallback filterType={filter.type} />;

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
          setFilter({ ...filter, value: newValue });
        }}
      >
        <div className="flex gap-4">
          <div className="flex gap-2">
            {Icon && <Icon className="text-muted-foreground" />}
            {option.label}
          </div>
          {count !== null && <MenuShortcut>{formatNumber(count)}</MenuShortcut>}
        </div>
      </MenuCheckboxItem>
    );
  });
}

function FilterValueControllerMultiOption({
  filter,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "multi-option";

  const isFilterValid = filter.type === filterType;
  const defaultValue = isFilterValid
    ? filter.value
    : filterMeta[filterType].defaultValue.value;

  const [value, setValue] = useState(defaultValue);

  if (!isFilterValid)
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
          setFilter({ ...filter, value: newValue });
        }}
      >
        <div className="flex gap-4">
          <div className="flex gap-2">
            {Icon && <Icon className="text-muted-foreground" />}
            {option.label}
          </div>
          {count !== null && <MenuShortcut>{formatNumber(count)}</MenuShortcut>}
        </div>
      </MenuCheckboxItem>
    );
  });
}

function FilterValueControllerTemporal({
  filter,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const defaultFilterType: FilterType = "date-time";

  const isFilterValid =
    filter.type === defaultFilterType ||
    filter.type === "date" ||
    filter.type === "time";

  const defaultValue = isFilterValid
    ? filter.value
    : filterMeta[defaultFilterType].defaultValue.value;

  const [tab, setTab] = useState<"single" | "range">(
    defaultValue.length === 2 ? "range" : "single",
  );

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!isFilterValid) return;
    setFilter({ ...filter, value });
  }, [isFilterValid, setFilter, filter, value]);

  if (!isFilterValid)
    return <FilterValueControllerErrorFallback filterType={filter.type} />;

  const { label } = columnMeta ?? {};

  let inputType = "date";
  let formatStr = "yyyy-MM-dd";

  if (filter.operator === "exactly") {
    formatStr = "yyyy-MM-dd'T'HH:mm";
    inputType = "datetime-local";
  }
  if (filter.type === "time") {
    formatStr = "HH:mm";
    inputType = "time";
  }

  return (
    <Tabs value={tab} onValueChange={setTab} className="gap-2">
      <TabsList className="w-full">
        <TabsTab value="single">Single</TabsTab>
        <TabsTab value="range">Range</TabsTab>
      </TabsList>

      <TabsPanel value="single" className="flex flex-col gap-2">
        <Calendar
          mode="single"
          selected={value[0] ?? undefined}
          onSelect={(date) => {
            if (date) setValue([date]);
          }}
          defaultMonth={value[0] ?? undefined}
          autoFocus
        />

        <InputGroup>
          <InputGroupInput
            type={inputType}
            value={value[0] ? format(value[0], formatStr) : ""}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              if (date) setValue([date]);
            }}
            placeholder={`Search ${label?.toLowerCase()}...`}
          />
        </InputGroup>
      </TabsPanel>
    </Tabs>
  );
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

    const operators = getFilterOperators(c.filter.type);
    const selectedOperatorLabel =
      operators.find((op) => op.value === c.filter.operator)?.label ??
      c.filter.operator;

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
                  c.setFilter({ ...c.filter, operator: op.value } as Filter);
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
          filter={c.filter}
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
  filter: Filter;
  popupType: FilterPopupType;
};

function FilterValueDisplayPopup({
  filter,
  popupType,
  children,
  ...props
}: FilterValueDisplayPopupProps) {
  if (EMPTY_FILTER_OPERATORS.some((o) => o.value === filter.operator))
    return null;

  const trigger = (
    <Button {...props}>
      <FilterValueDisplay filter={filter} />
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
      <PopoverPopup className="w-fit max-w-3xs rounded-xl *:p-1">
        {children}
      </PopoverPopup>
    </Popover>
  );
}

type FilterValueDisplayProps<T extends FilterType> = Extract<
  Filter,
  { type: T }
>;

function FilterValueDisplay({ filter }: { filter: Filter }) {
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
  const [v1, v2] = value;

  let formatStr = "PPP";

  if (type === "date-time" && operator === "exactly") formatStr = "PPPp";
  if (type === "time") formatStr = "p";

  if (!v1) return <EllipsisIcon />;
  if (!v2) return format(v1, formatStr);
  return `${format(v1, formatStr)} - ${format(v2, formatStr)}`;
}

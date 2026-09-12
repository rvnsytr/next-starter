import { Calendar } from "@/core/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Label } from "@/core/components/ui/label";
import { MenuCheckboxItem, MenuShortcut } from "@/core/components/ui/menu";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/core/components/ui/number-field";
import { Slider } from "@/core/components/ui/slider";
import { Switch } from "@/core/components/ui/switch";
import { useDebounce } from "@/core/hooks/use-debounce";
import { filterMeta } from "@/core/modules/table/filter-meta";
import { EMPTY_FILTER_OPERATOR_VALUES } from "@/core/modules/table/operators";
import { ColumnFilterContext, FilterType } from "@/core/modules/table/types";
import { cn, formatNumber } from "@/core/utils";
import { ErrorFallback } from "@/shared/components/fallback";
import { appConfig } from "@/shared/configs";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { FilterOperatorSelector } from "./filter-operator-selector";

export type FilterValueControllerProps = {
  context: ColumnFilterContext;
  disabled: boolean;
};

function FilterValueControllerErrorFallback({
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

export function FilterValueController({ context }: FilterValueControllerProps) {
  const { type, operator } = context.filter;

  const isDisabled = useMemo(
    () => EMPTY_FILTER_OPERATOR_VALUES.some((v) => v === operator),
    [operator],
  );

  switch (type) {
    case "string":
      return (
        <FilterValueControllerString context={context} disabled={isDisabled} />
      );

    case "number":
      return (
        <FilterValueControllerNumber context={context} disabled={isDisabled} />
      );

    case "boolean":
      return (
        <FilterValueControllerBoolean context={context} disabled={isDisabled} />
      );

    case "option":
      return (
        <FilterValueControllerOption context={context} disabled={isDisabled} />
      );

    case "multi-option":
      return (
        <FilterValueControllerMultiOption
          context={context}
          disabled={isDisabled}
        />
      );

    case "date-time":
    case "date":
    case "time":
      return (
        <FilterValueControllerTemporal
          context={context}
          disabled={isDisabled}
        />
      );

    default:
      return <FilterValueControllerErrorFallback filterType={type} />;
  }
}

function FilterValueControllerString({
  context,
  disabled,
}: FilterValueControllerProps) {
  const { filter, setFilter, columnMeta } = context;
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
  }, [debouncedValue, filter, isFilterValid, setFilter]);

  if (!isFilterValid)
    return <FilterValueControllerErrorFallback filterType={filter.type} />;

  const { label, icon: Icon } = columnMeta ?? {};

  return (
    <div className="flex flex-col gap-y-2">
      <FilterOperatorSelector context={context} />

      <InputGroup>
        <InputGroupInput
          value={value}
          onChange={(e) => setValue(String(e.target.value))}
          placeholder={`Search ${label?.toLowerCase()}...`}
          disabled={disabled}
          autoFocus
        />

        {Icon && (
          <InputGroupAddon>
            <Icon />
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}

function FilterValueControllerNumber({
  context,
  disabled,
}: FilterValueControllerProps) {
  const { filter, setFilter, columnMeta } = context;
  const filterType: FilterType = "number";

  const isFilterValid = filter.type === filterType;
  const defaultValue = isFilterValid
    ? filter.value
    : filterMeta[filterType].defaultValue.value;

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
  }, [debouncedValue, filter, isFilterValid, setFilter]);

  if (!isFilterValid)
    return <FilterValueControllerErrorFallback filterType={filter.type} />;

  const { label } = columnMeta ?? {};

  return (
    <div className="flex flex-col gap-y-2">
      <FilterOperatorSelector context={context} />

      {filter.operator.includes("between") ? (
        <>
          <Slider
            min={sliderScale.min}
            max={sliderScale.max}
            value={value}
            onValueChange={(v) => {
              if (typeof v === "number") return setValue([v]);
              setValue([...v]);
            }}
            className="mt-2"
            disabled={disabled}
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
                    {formatNumber(tick.value)}
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
              disabled={disabled}
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
              disabled={disabled}
            >
              <NumberFieldGroup>
                <NumberFieldInput placeholder="To" />
                <NumberFieldDecrement />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>
          </div>
        </>
      ) : (
        <NumberField
          size="sm"
          value={value[0] ?? 0}
          onValueChange={(v) => setValue(() => [v ?? 0])}
          locale={appConfig.default.numberLocale}
          disabled={disabled}
          autoFocus
        >
          <NumberFieldGroup>
            <NumberFieldInput placeholder={`Enter ${label?.toLowerCase()}`} />
            <NumberFieldDecrement />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      )}
    </div>
  );
}

function FilterValueControllerBoolean({
  context,
  disabled,
}: FilterValueControllerProps) {
  const { filter, setFilter, columnMeta } = context;
  const filterType: FilterType = "boolean";

  const isFilterValid = filter.type === filterType;
  const defaultValue = isFilterValid
    ? filter.value
    : filterMeta[filterType].defaultValue.value;

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
        defaultChecked={defaultValue}
        checked={filter.value}
        onCheckedChange={(v) => {
          setFilter({ ...filter, value: v });
        }}
        disabled={disabled}
        autoFocus
      />
    </Label>
  );
}

function FilterValueControllerOption({
  context,
  disabled,
}: FilterValueControllerProps) {
  const { filter, setFilter, columnMeta } = context;
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
        disabled={disabled}
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
  context,
  disabled,
}: FilterValueControllerProps) {
  const { filter, setFilter, columnMeta } = context;
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
        disabled={disabled}
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
  context,
  disabled,
}: FilterValueControllerProps) {
  const { filter, setFilter, columnMeta } = context;
  const defaultFilterType: FilterType = "date-time";

  const isFilterValid =
    filter.type === defaultFilterType ||
    filter.type === "date" ||
    filter.type === "time";

  const defaultValue = isFilterValid
    ? filter.value
    : filterMeta[defaultFilterType].defaultValue.value;

  const [value, setValue] = useState(defaultValue);

  const options = useMemo(() => {
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

    return { inputType, formatStr };
  }, [filter.type, filter.operator]);

  useEffect(() => {
    if (!isFilterValid) return;
    setFilter({ ...filter, value });
  }, [filter, isFilterValid, setFilter, value]);

  if (!isFilterValid)
    return <FilterValueControllerErrorFallback filterType={filter.type} />;

  const { label } = columnMeta ?? {};

  return (
    <div className="flex flex-col gap-2">
      <FilterOperatorSelector context={context} />

      {filter.operator.includes("between") ? (
        <Calendar
          mode="range"
          selected={{ from: value[0], to: value[1] }}
          onSelect={(dateRange) => {
            if (dateRange) setValue([dateRange.from, dateRange.to]);
          }}
          defaultMonth={value[0] ?? undefined}
          disabled={disabled}
          autoFocus
        />
      ) : (
        <>
          <Calendar
            mode="single"
            selected={value[0] ?? undefined}
            onSelect={(date) => {
              if (date) setValue([date]);
            }}
            defaultMonth={value[0] ?? undefined}
            disabled={disabled}
            autoFocus
          />

          <InputGroup>
            <InputGroupInput
              type={options.inputType}
              value={value[0] ? format(value[0], options.formatStr) : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                if (date) setValue([date]);
              }}
              placeholder={`Search ${label?.toLowerCase()}...`}
              disabled={disabled}
            />
          </InputGroup>
        </>
      )}
    </div>
  );
}

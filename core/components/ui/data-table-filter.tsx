"use client";

import { messages } from "@/core/constants/messages";
import {
  ColumnDataType,
  ColumnOption,
  ElementType,
  FilterModel,
  createNumberRange,
  dateFilterDetails,
  determineNewOperator,
  filterTypeOperatorDetails,
  getColumn,
  getColumnMeta,
  isColumnOptionArray,
  isFilterableColumn,
  multiOptionFilterDetails,
  numberFilterDetails,
  optionFilterDetails,
  textFilterDetails,
} from "@/core/filter";
import { useDebounce } from "@/core/hooks/use-debounce";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { formatDate } from "@/core/utils/date";
import { formatNumber } from "@/core/utils/formaters";
import { cn } from "@/core/utils/helpers";
import { Column, ColumnMeta, RowData, Table } from "@tanstack/react-table";
import { endOfDay, isEqual } from "date-fns";
import {
  ArrowRightIcon,
  EllipsisIcon,
  FilterIcon,
  FilterXIcon,
  XIcon,
} from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { DateRange, TZDate } from "react-day-picker";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { Calendar } from "./calendar";
import { Checkbox } from "./checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Slider } from "./slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

export function DataTableFilter<TData>({ table }: { table: Table<TData> }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex gap-1">
          <FilterSelector table={table} />
          <FilterActions table={table} />
        </div>
        <ActiveFiltersMobileContainer>
          <ActiveFilters table={table} />
        </ActiveFiltersMobileContainer>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex w-full flex-1 items-center gap-2 md:flex-wrap">
        <FilterSelector table={table} />
        <ActiveFilters table={table} />
      </div>

      <FilterActions table={table} />
    </div>
  );
}

export function ActiveFiltersMobileContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(true);

  // Check if there's content to scroll and update blur states
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      // Show left blur if scrolled to the right
      setShowLeftBlur(scrollLeft > 0);

      // Show right blur if there's more content to scroll to the right
      // Add a small buffer (1px) to account for rounding errors
      setShowRightBlur(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  // Log blur states for debugging
  // useEffect(() => {
  //   console.log("left:", showLeftBlur, "  right:", showRightBlur);
  // }, [showLeftBlur, showRightBlur]);

  // Set up ResizeObserver to monitor container size
  useEffect(() => {
    if (scrollContainerRef.current) {
      const resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(scrollContainerRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  // Update blur states when children change
  useEffect(() => checkScroll(), [children]);

  return (
    <div
      className={cn(
        "w-full border-t border-b border-dashed shadow-xs",
        className,
      )}
    >
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className={cn(
          "no-scrollbar flex items-center gap-2 overflow-x-auto py-2",
          showLeftBlur && "mask-l-from-95%",
          showRightBlur && "mask-r-from-95%",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function FilterActions<TData>({
  table,
  className,
}: {
  table: Table<TData>;
  className?: string;
}) {
  return (
    <Button
      size="sm"
      variant="outline_destructive"
      className={className}
      onClick={() => {
        table.setColumnFilters([]);
        table.setGlobalFilter("");
      }}
    >
      <FilterXIcon /> {messages.actions.clear}
    </Button>
  );
}

export function FilterSelector<TData>({ table }: { table: Table<TData> }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [property, setProperty] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const column = property ? getColumn(table, property) : undefined;
  const columnMeta = property ? getColumnMeta(table, property) : undefined;

  const properties = table.getAllColumns().filter(isFilterableColumn);

  // const hasFilters = table.getState().columnFilters.length > 0;
  const onFilter = useEffectEvent(() => {
    inputRef.current?.focus();
    setValue("");
  });

  useEffect(() => {
    if (property && inputRef) onFilter();
  }, [property]);

  useEffect(() => {
    if (!open) setTimeout(() => setValue(""), 150);
  }, [open]);

  const content = useMemo(
    () =>
      property && column && columnMeta ? (
        <FitlerValueController
          id={property}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      ) : (
        <Command loop>
          <CommandInput
            value={value}
            onValueChange={setValue}
            ref={inputRef}
            placeholder="Cari Kolom..."
          />
          <CommandEmpty>{messages.empty}</CommandEmpty>
          <CommandList className="max-h-fit">
            <CommandGroup>
              {properties.map((column) => (
                <FilterableColumn
                  key={column.id}
                  column={column}
                  table={table}
                  setProperty={setProperty}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      ),
    [property, column, columnMeta, value, table, properties],
  );

  return (
    <Popover
      open={open}
      onOpenChange={async (value) => {
        setOpen(value);
        if (!value) setTimeout(() => setProperty(undefined), 100);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FilterIcon /> Filter
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-fit origin-(--radix-popover-content-transform-origin) p-0"
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}

export function FilterableColumn<TData>({
  column,
  setProperty,
}: {
  column: Column<TData>;
  table: Table<TData>;
  setProperty: (value: string) => void;
}) {
  const Icon = column.columnDef.meta?.icon;
  return (
    <CommandItem onSelect={() => setProperty(column.id)} className="group">
      <div className="flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-1.5">
          {Icon && <Icon />}
          <span>{column.columnDef.meta?.displayName}</span>
        </div>
        <ArrowRightIcon className="opacity-0 group-aria-selected:opacity-100" />
      </div>
    </CommandItem>
  );
}

export function ActiveFilters<TData>({ table }: { table: Table<TData> }) {
  const filters = table.getState().columnFilters;

  return (
    <>
      {filters.map((filter) => {
        const { id } = filter;

        const column = getColumn(table, id);
        const meta = getColumnMeta(table, id);

        // Skip if no filter value
        if (!filter.value) return null;

        // Narrow the type based on meta.type and cast filter accordingly
        switch (meta.type) {
          case "text":
            return renderFilter<TData, "text">(
              filter as { id: string; value: FilterModel<"text", TData> },
              column,
              meta as ColumnMeta<TData, unknown> & { type: "text" },
              table,
            );
          case "number":
            return renderFilter<TData, "number">(
              filter as { id: string; value: FilterModel<"number", TData> },
              column,
              meta as ColumnMeta<TData, unknown> & { type: "number" },
              table,
            );
          case "date":
            return renderFilter<TData, "date">(
              filter as { id: string; value: FilterModel<"date", TData> },
              column,
              meta as ColumnMeta<TData, unknown> & { type: "date" },
              table,
            );
          case "option":
            return renderFilter<TData, "option">(
              filter as { id: string; value: FilterModel<"option", TData> },
              column,
              meta as ColumnMeta<TData, unknown> & { type: "option" },
              table,
            );
          case "multiOption":
            return renderFilter<TData, "multiOption">(
              filter as {
                id: string;
                value: FilterModel<"multiOption", TData>;
              },
              column,
              meta as ColumnMeta<TData, unknown> & { type: "multiOption" },
              table,
            );
          default:
            return null; // Handle unknown types gracefully
        }
      })}
    </>
  );
}

// Generic render function for a filter with type-safe value
function renderFilter<TData, T extends ColumnDataType>(
  filter: { id: string; value: FilterModel<T, TData> },
  column: Column<TData, unknown>,
  meta: ColumnMeta<TData, unknown> & { type: T },
  table: Table<TData>,
) {
  const { id, value } = filter;

  return (
    <ButtonGroup key={`filter-${id}`} className="**:text-xs">
      <FilterSubject meta={meta} />
      <FilterOperator column={column} columnMeta={meta} filter={value} />
      <FilterValue id={id} column={column} columnMeta={meta} table={table} />
      <Button
        size="icon-sm"
        variant="outline"
        onClick={() => table.getColumn(id)?.setFilterValue(undefined)}
      >
        <XIcon />
      </Button>
    </ButtonGroup>
  );
}

/****** Property Filter Subject ******/

export function FilterSubject<TData>({
  meta,
}: {
  meta: ColumnMeta<TData, string>;
}) {
  const hasIcon = !!meta?.icon;
  return (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-1.5 px-2 font-medium whitespace-nowrap select-none"
    >
      {hasIcon && <meta.icon />}
      <span>{meta.displayName}</span>
    </Button>
  );
}

/****** Property Filter Operator ******/

// Renders the filter operator display and menu for a given column filter
// The filter operator display is the label and icon for the filter operator
// The filter operator menu is the dropdown menu for the filter operator
export function FilterOperator<TData, T extends ColumnDataType>({
  column,
  columnMeta,
  filter,
}: {
  column: Column<TData, unknown>;
  columnMeta: ColumnMeta<TData, unknown>;
  filter: FilterModel<T, TData>;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const close = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <FilterOperatorDisplay filter={filter} filterType={columnMeta.type} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-fit p-0">
        <Command loop>
          <CommandInput placeholder="Cari Operator..." />
          <CommandEmpty>{messages.empty}</CommandEmpty>
          <CommandList className="max-h-fit">
            <FilterOperatorController column={column} closeController={close} />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function FilterOperatorDisplay<TData, T extends ColumnDataType>({
  filter,
  filterType,
}: {
  filter: FilterModel<T, TData>;
  filterType: T;
}) {
  const details = filterTypeOperatorDetails[filterType][filter.operator];

  return <span>{details.label}</span>;
}

interface FilterOperatorControllerProps<TData> {
  column: Column<TData, unknown>;
  closeController: () => void;
}

export function FilterOperatorController<TData>({
  column,
  closeController,
}: FilterOperatorControllerProps<TData>) {
  const { type } = column.columnDef.meta!;

  switch (type) {
    case "option":
      return (
        <FilterOperatorOptionController
          column={column}
          closeController={closeController}
        />
      );
    case "multiOption":
      return (
        <FilterOperatorMultiOptionController
          column={column}
          closeController={closeController}
        />
      );
    case "date":
      return (
        <FilterOperatorDateController
          column={column}
          closeController={closeController}
        />
      );
    case "text":
      return (
        <FilterOperatorTextController
          column={column}
          closeController={closeController}
        />
      );
    case "number":
      return (
        <FilterOperatorNumberController
          column={column}
          closeController={closeController}
        />
      );
    default:
      return null;
  }
}

function FilterOperatorOptionController<TData>({
  column,
  closeController,
}: FilterOperatorControllerProps<TData>) {
  const filter = column.getFilterValue() as FilterModel<"option", TData>;
  const filterDetails = optionFilterDetails[filter.operator];

  const relatedFilters = Object.values(optionFilterDetails).filter(
    (o) => o.target === filterDetails.target,
  );

  const changeOperator = (operator: string) => {
    column.setFilterValue((old: typeof filter) => ({ ...old, operator }));
    closeController();
  };

  return (
    <CommandGroup heading="Operators">
      {relatedFilters.map((r) => (
        <CommandItem onSelect={changeOperator} value={r.value} key={r.value}>
          {r.label}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

function FilterOperatorMultiOptionController<TData>({
  column,
  closeController,
}: FilterOperatorControllerProps<TData>) {
  const filter = column.getFilterValue() as FilterModel<"multiOption", TData>;
  const filterDetails = multiOptionFilterDetails[filter.operator];

  const relatedFilters = Object.values(multiOptionFilterDetails).filter(
    (o) => o.target === filterDetails.target,
  );

  const changeOperator = (operator: string) => {
    column.setFilterValue((old: typeof filter) => ({ ...old, operator }));
    closeController();
  };

  return (
    <CommandGroup heading="Operators">
      {relatedFilters.map((r) => (
        <CommandItem onSelect={changeOperator} value={r.value} key={r.value}>
          {r.label}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

function FilterOperatorDateController<TData>({
  column,
  closeController,
}: FilterOperatorControllerProps<TData>) {
  const filter = column.getFilterValue() as FilterModel<"date", TData>;
  const filterDetails = dateFilterDetails[filter.operator];

  const relatedFilters = Object.values(dateFilterDetails).filter(
    (o) => o.target === filterDetails.target,
  );

  const changeOperator = (operator: string) => {
    column.setFilterValue((old: typeof filter) => ({ ...old, operator }));
    closeController();
  };

  return (
    <CommandGroup>
      {relatedFilters.map((r) => (
        <CommandItem onSelect={changeOperator} value={r.value} key={r.value}>
          {r.label}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

export function FilterOperatorTextController<TData>({
  column,
  closeController,
}: FilterOperatorControllerProps<TData>) {
  const filter = column.getFilterValue() as FilterModel<"text", TData>;
  const filterDetails = textFilterDetails[filter.operator];

  const relatedFilters = Object.values(textFilterDetails).filter(
    (o) => o.target === filterDetails.target,
  );

  const changeOperator = (operator: string) => {
    column.setFilterValue((old: typeof filter) => ({ ...old, operator }));
    closeController();
  };

  return (
    <CommandGroup heading="Operators">
      {relatedFilters.map((r) => (
        <CommandItem onSelect={changeOperator} value={r.value} key={r.value}>
          {r.label}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

function FilterOperatorNumberController<TData>({
  column,
  closeController,
}: FilterOperatorControllerProps<TData>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filter = column.getFilterValue() as FilterModel<"number", TData>;

  // Show all related operators
  const relatedFilters = Object.values(numberFilterDetails);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const relatedFilterOperators = relatedFilters.map((r) => r.value);

  const changeOperator = (
    operator: (typeof relatedFilterOperators)[number],
  ) => {
    column.setFilterValue((old: typeof filter) => {
      // Clear out the second value when switching to single-input operators
      const target = numberFilterDetails[operator].target;
      const newValues =
        target === "single" ? [old.values[0]] : createNumberRange(old.values);
      return { ...old, operator, values: newValues };
    });
    closeController();
  };

  return (
    <CommandGroup heading="Operators">
      {relatedFilters.map((r) => (
        <CommandItem
          onSelect={() => changeOperator(r.value)}
          value={r.value}
          key={r.value}
        >
          {r.label}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

/****** Property Filter Value ******/

export function FilterValue<TData, TValue>({
  id,
  column,
  columnMeta,
  table,
}: {
  id: string;
  column: Column<TData>;
  columnMeta: ColumnMeta<TData, TValue>;
  table: Table<TData>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <FilterValueDisplay
            id={id}
            column={column}
            columnMeta={columnMeta}
            table={table}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit origin-(--radix-popover-content-transform-origin) p-0">
        <FitlerValueController
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      </PopoverContent>
    </Popover>
  );
}

interface FilterValueDisplayProps<TData, TValue> {
  id: string;
  column: Column<TData>;
  columnMeta: ColumnMeta<TData, TValue>;
  table: Table<TData>;
}

export function FilterValueDisplay<TData, TValue>({
  id,
  column,
  columnMeta,
  table,
}: FilterValueDisplayProps<TData, TValue>) {
  switch (columnMeta.type) {
    case "option":
      return (
        <FilterValueOptionDisplay
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    case "multiOption":
      return (
        <FilterValueMultiOptionDisplay
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    case "date":
      return (
        <FilterValueDateDisplay
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    case "text":
      return (
        <FilterValueTextDisplay
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    case "number":
      return (
        <FilterValueNumberDisplay
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    default:
      return null;
  }
}

function uniq<T>(a: T[]): T[] {
  return Array.from(new Set(a));
}

export function FilterValueOptionDisplay<TData, TValue>({
  id,
  column,
  columnMeta,
  table,
}: FilterValueDisplayProps<TData, TValue>) {
  let options: ColumnOption[];
  const columnVals = table
    .getCoreRowModel()
    .rows.flatMap((r) => r.getValue<TValue>(id))
    .filter((v): v is NonNullable<TValue> => v !== undefined && v !== null);
  const uniqueVals = uniq(columnVals);

  // If static options are provided, use them
  if (columnMeta.options) options = columnMeta.options;
  // No static options provided,
  // We should dynamically generate them based on the column data
  else if (columnMeta.transformOptionFn) {
    const transformOptionFn = columnMeta.transformOptionFn;

    options = uniqueVals.map((v) =>
      transformOptionFn(v as ElementType<NonNullable<TValue>>),
    );
  }

  // Make sure the column data conforms to ColumnOption type
  else if (isColumnOptionArray(uniqueVals)) options = uniqueVals;
  // Invalid configuration
  else
    throw new Error(
      `[data-table-filter] [${id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to ColumnOption type`,
    );

  const filter = column.getFilterValue() as FilterModel<"option", TData>;
  const selected = options.filter((o) => filter?.values.includes(o.value));

  // We display the selected options based on how many are selected
  //
  // If there is only one option selected, we display its icon and label
  //
  // If there are multiple options selected, we display:
  // 1) up to 3 icons of the selected options
  // 2) the number of selected options
  if (selected.length === 1) {
    const { label, icon: Icon } = selected[0];
    const hasIcon = !!Icon;
    return (
      <span className="inline-flex items-center gap-1">
        {hasIcon && (isValidElement(Icon) ? Icon : <Icon />)}
        <span>{label}</span>
      </span>
    );
  }

  const name = columnMeta.displayName.toLowerCase();
  const pluralName = name.endsWith("s") ? `${name}es` : `${name}s`;
  const hasOptionIcons = !options?.some((o) => !o.icon);

  return (
    <div className="inline-flex items-center gap-0.5">
      {hasOptionIcons &&
        selected.slice(0, 3).map(({ value, icon }) => {
          const Icon = icon!;
          return isValidElement(Icon) ? Icon : <Icon key={value} />;
        })}
      <span className={cn(hasOptionIcons && "ml-1.5")}>
        {selected.length} {pluralName}
      </span>
    </div>
  );
}

export function FilterValueMultiOptionDisplay<TData, TValue>({
  id,
  column,
  columnMeta,
  table,
}: FilterValueDisplayProps<TData, TValue>) {
  let options: ColumnOption[];
  const columnVals = table
    .getCoreRowModel()
    .rows.flatMap((r) => r.getValue<TValue>(id))
    .filter((v): v is NonNullable<TValue> => v !== undefined && v !== null);
  const uniqueVals = uniq(columnVals);

  // If static options are provided, use them
  if (columnMeta.options) options = columnMeta.options;
  // No static options provided,
  // We should dynamically generate them based on the column data
  else if (columnMeta.transformOptionFn) {
    const transformOptionFn = columnMeta.transformOptionFn;

    options = uniqueVals.map((v) =>
      transformOptionFn(v as ElementType<NonNullable<TValue>>),
    );
  }

  // Make sure the column data conforms to ColumnOption type
  else if (isColumnOptionArray(uniqueVals)) options = uniqueVals;
  // Invalid configuration
  else {
    throw new Error(
      `[data-table-filter] [${id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to ColumnOption type`,
    );
  }

  const filter = column.getFilterValue() as FilterModel<"multiOption", TData>;
  const selected = options.filter((o) => filter?.values[0].includes(o.value));

  if (selected.length === 1) {
    const { label, icon: Icon } = selected[0];
    const hasIcon = !!Icon;
    return (
      <span className="inline-flex items-center gap-1.5">
        {hasIcon && (isValidElement(Icon) ? Icon : <Icon />)}
        <span>{label}</span>
      </span>
    );
  }

  const name = columnMeta.displayName.toLowerCase();
  const hasOptionIcons = !columnMeta.options?.some((o) => !o.icon);

  return (
    <div className="inline-flex items-center gap-1.5">
      {hasOptionIcons && (
        <div key="icons" className="inline-flex items-center gap-0.5">
          {selected.slice(0, 3).map(({ value, icon }) => {
            const Icon = icon!;
            return isValidElement(Icon) ? (
              cloneElement(Icon, { key: value })
            ) : (
              <Icon key={value} />
            );
          })}
        </div>
      )}
      <span>
        {selected.length} {name}
      </span>
    </div>
  );
}

function formatDateRange(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth && sameYear)
    return `${formatDate(start, "MMM d")} - ${formatDate(end, "d, yyyy")}`;

  if (sameYear)
    return `${formatDate(start, "MMM d")} - ${formatDate(end, "MMM d, yyyy")}`;

  return `${formatDate(start, "MMM d, yyyy")} - ${formatDate(end, "MMM d, yyyy")}`;
}

export function FilterValueDateDisplay<TData, TValue>({
  column,
}: FilterValueDisplayProps<TData, TValue>) {
  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterModel<"date", TData>)
    : undefined;

  if (!filter) return null;
  if (filter.values.length === 0) return <EllipsisIcon />;
  if (filter.values.length === 1) {
    const value = filter.values[0];
    const formattedDateStr = formatDate(value, "MMM d, yyyy");
    return <span>{formattedDateStr}</span>;
  }

  const formattedRangeStr = formatDateRange(filter.values[0], filter.values[1]);

  return <span>{formattedRangeStr}</span>;
}

export function FilterValueTextDisplay<TData, TValue>({
  column,
}: FilterValueDisplayProps<TData, TValue>) {
  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterModel<"text", TData>)
    : undefined;

  if (!filter) return null;
  if (filter.values.length === 0 || filter.values[0].trim() === "")
    return <EllipsisIcon />;

  const value = filter.values[0];

  return <span>{value}</span>;
}

export function FilterValueNumberDisplay<TData, TValue>({
  column,
  columnMeta,
}: FilterValueDisplayProps<TData, TValue>) {
  const cappedMax = columnMeta.max ?? 2147483647;

  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterModel<"number", TData>)
    : undefined;

  if (!filter) return null;

  if (
    filter.operator === "is between" ||
    filter.operator === "is not between"
  ) {
    const minValue = filter.values[0];
    const maxValue =
      filter.values[1] === Number.POSITIVE_INFINITY ||
      filter.values[1] >= cappedMax
        ? `${cappedMax}+`
        : filter.values[1];

    return (
      <span className="tracking-tight tabular-nums">
        {minValue} and {maxValue}
      </span>
    );
  }

  if (!filter.values || filter.values.length === 0) return null;

  const value = filter.values[0];
  return <span className="tracking-tight tabular-nums">{value}</span>;
}

export function FitlerValueController<TData, TValue>({
  id,
  column,
  columnMeta,
  table,
}: {
  id: string;
  column: Column<TData>;
  columnMeta: ColumnMeta<TData, TValue>;
  table: Table<TData>;
}) {
  switch (columnMeta.type) {
    case "option":
      return (
        <FilterValueOptionController
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    case "multiOption":
      return (
        <FilterValueMultiOptionController
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    case "date":
      return (
        <FilterValueDateController
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    case "text":
      return (
        <FilterValueTextController
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    case "number":
      return (
        <FilterValueNumberController
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
    default:
      return null;
  }
}

interface ProperFilterValueMenuProps<TData, TValue> {
  id: string;
  column: Column<TData>;
  columnMeta: ColumnMeta<TData, TValue>;
  table: Table<TData>;
}

export function FilterValueOptionController<TData, TValue>({
  id,
  column,
  columnMeta,
  table,
}: ProperFilterValueMenuProps<TData, TValue>) {
  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterModel<"option", TData>)
    : undefined;

  let options: ColumnOption[];
  const columnVals = table
    .getCoreRowModel()
    .rows.flatMap((r) => r.getValue<TValue>(id))
    .filter((v): v is NonNullable<TValue> => v !== undefined && v !== null);

  const uniqueVals = uniq(columnVals);

  // If static options are provided, use them
  if (columnMeta.options) options = columnMeta.options;
  // No static options provided,
  // We should dynamically generate them based on the column data
  else if (columnMeta.transformOptionFn) {
    const transformOptionFn = columnMeta.transformOptionFn;
    options = uniqueVals.map((v) =>
      transformOptionFn(v as ElementType<NonNullable<TValue>>),
    );
  }

  // Make sure the column data conforms to ColumnOption type
  else if (isColumnOptionArray(uniqueVals)) options = uniqueVals;
  // Invalid configuration
  else {
    throw new Error(
      `[data-table-filter] [${id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to ColumnOption type`,
    );
  }

  const optionsCount: Record<ColumnOption["value"], number> = columnVals.reduce(
    (acc, curr) => {
      const { value } = columnMeta.transformOptionFn
        ? columnMeta.transformOptionFn(curr as ElementType<NonNullable<TValue>>)
        : { value: curr as string };

      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    },
    {} as Record<ColumnOption["value"], number>,
  );

  const handleOptionSelect = (value: string, check: boolean) => {
    if (check)
      column?.setFilterValue(
        (old: undefined | FilterModel<"option", TData>) => {
          if (!old || old.values.length === 0)
            return {
              operator: "is",
              values: [value],
              columnMeta: column.columnDef.meta,
            } satisfies FilterModel<"option", TData>;

          const newValues = [...old.values, value];

          return {
            operator: "is any of",
            values: newValues,
            columnMeta: column.columnDef.meta,
          } satisfies FilterModel<"option", TData>;
        },
      );
    else
      column?.setFilterValue(
        (old: undefined | FilterModel<"option", TData>) => {
          if (!old || old.values.length <= 1) return undefined;

          const newValues = old.values.filter((v) => v !== value);
          return {
            operator: newValues.length > 1 ? "is any of" : "is",
            values: newValues,
            columnMeta: column.columnDef.meta,
          } satisfies FilterModel<"option", TData>;
        },
      );
  };

  return (
    <Command loop>
      <CommandInput
        autoFocus
        placeholder={`Cari ${columnMeta.displayName}...`}
      />
      <CommandEmpty>{messages.empty}</CommandEmpty>
      <CommandList className="max-h-fit">
        <CommandGroup>
          {options.map(({ value, label, icon: Icon, count }) => {
            const checked = Boolean(filter?.values.includes(value));
            return (
              <CommandItem
                key={value}
                onSelect={() => handleOptionSelect(value, !checked)}
                className="group flex items-center justify-between gap-2"
              >
                <Checkbox checked={checked} />

                {Icon &&
                  (isValidElement(Icon) ? (
                    Icon
                  ) : (
                    <Icon
                      className={cn(
                        checked ? "text-foreground" : "text-muted-foreground",
                      )}
                    />
                  ))}

                <span>{label}</span>

                <span
                  className={cn(
                    "ml-auto tracking-tight",
                    count === 0 && "slashed-zero",
                  )}
                >
                  {/* {count < 999 ? formatNumber(count) : "999+"} */}
                  {formatNumber(count ?? optionsCount[value] ?? 0)}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function FilterValueMultiOptionController<
  TData extends RowData,
  TValue,
>({
  id,
  column,
  columnMeta,
  table,
}: ProperFilterValueMenuProps<TData, TValue>) {
  const filter = column.getFilterValue() as
    | FilterModel<"multiOption", TData>
    | undefined;

  let options: ColumnOption[];
  const columnVals = table
    .getCoreRowModel()
    .rows.flatMap((r) => r.getValue<TValue>(id))
    .filter((v): v is NonNullable<TValue> => v !== undefined && v !== null);
  const uniqueVals = uniq(columnVals);

  // If static options are provided, use them
  if (columnMeta.options) options = columnMeta.options;
  // No static options provided,
  // We should dynamically generate them based on the column data
  else if (columnMeta.transformOptionFn) {
    const transformOptionFn = columnMeta.transformOptionFn;
    options = uniqueVals.map((v) =>
      transformOptionFn(v as ElementType<NonNullable<TValue>>),
    );
  }

  // Make sure the column data conforms to ColumnOption type
  else if (isColumnOptionArray(uniqueVals)) options = uniqueVals;
  // Invalid configuration
  else {
    throw new Error(
      `[data-table-filter] [${id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to ColumnOption type`,
    );
  }

  const optionsCount: Record<ColumnOption["value"], number> = columnVals.reduce(
    (acc, curr) => {
      const value = columnMeta.options
        ? (curr as string)
        : columnMeta.transformOptionFn!(
            curr as ElementType<NonNullable<TValue>>,
          ).value;

      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    },
    {} as Record<ColumnOption["value"], number>,
  );

  // Handles the selection/deselection of an option
  const handleOptionSelect = (value: string, check: boolean) => {
    if (check) {
      column.setFilterValue(
        (old: undefined | FilterModel<"multiOption", TData>) => {
          if (
            !old ||
            old.values.length === 0 ||
            !old.values[0] ||
            old.values[0].length === 0
          )
            return {
              operator: "include",
              values: [[value]],
              columnMeta: column.columnDef.meta,
            } satisfies FilterModel<"multiOption", TData>;

          const newValues = [uniq([...old.values[0], value])];

          return {
            operator: determineNewOperator(
              "multiOption",
              old.values,
              newValues,
              old.operator,
            ),
            values: newValues,
            columnMeta: column.columnDef.meta,
          } satisfies FilterModel<"multiOption", TData>;
        },
      );
    } else
      column.setFilterValue(
        (old: undefined | FilterModel<"multiOption", TData>) => {
          if (!old?.values[0] || old.values[0].length <= 1) return undefined;

          const newValues = [
            uniq([...old.values[0], value]).filter((v) => v !== value),
          ];

          return {
            operator: determineNewOperator(
              "multiOption",
              old.values,
              newValues,
              old.operator,
            ),
            values: newValues,
            columnMeta: column.columnDef.meta,
          } satisfies FilterModel<"multiOption", TData>;
        },
      );
  };

  return (
    <Command loop>
      <CommandInput
        autoFocus
        placeholder={`Cari ${columnMeta.displayName}...`}
      />
      <CommandEmpty>{messages.empty}</CommandEmpty>
      <CommandList>
        <CommandGroup>
          {options.map(({ value, label, icon: Icon, count }) => {
            const checked = Boolean(filter?.values[0]?.includes(value));
            return (
              <CommandItem
                key={value}
                onSelect={() => handleOptionSelect(value, !checked)}
                className="group flex items-center justify-between gap-2"
              >
                <Checkbox checked={checked} />

                {Icon &&
                  (isValidElement(Icon) ? (
                    Icon
                  ) : (
                    <Icon
                      className={cn(
                        checked ? "text-foreground" : "text-muted-foreground",
                      )}
                    />
                  ))}

                <span>{label}</span>

                <span
                  className={cn(
                    "ml-auto tracking-tight",
                    count === 0 && "slashed-zero",
                  )}
                >
                  {/* {count < 999 ? formatNumber(count) : "999+"} */}
                  {formatNumber(count ?? optionsCount[value] ?? 0)}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function FilterValueDateController<TData, TValue>({
  column,
}: ProperFilterValueMenuProps<TData, TValue>) {
  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterModel<"date", TData>)
    : undefined;

  const [date, setDate] = useState<DateRange | undefined>({
    from: filter?.values[0] ?? new TZDate(),
    to: filter?.values[1] ?? undefined,
  });

  const changeDateRange = (value: DateRange | undefined) => {
    const start = value?.from;
    const end =
      start && value?.to && !isEqual(start, value.to)
        ? endOfDay(value.to)
        : undefined;

    setDate({ from: start, to: end });

    const isRange = start && end;
    const newValues = isRange ? [start, end] : start ? [start] : [];

    column.setFilterValue((old: undefined | FilterModel<"date", TData>) => {
      if (!old || old.values.length === 0)
        return {
          operator: newValues.length > 1 ? "is between" : "is",
          values: newValues,
          columnMeta: column.columnDef.meta,
        } satisfies FilterModel<"date", TData>;

      return {
        operator:
          old.values.length < newValues.length
            ? "is between"
            : old.values.length > newValues.length
              ? "is"
              : old.operator,
        values: newValues,
        columnMeta: column.columnDef.meta,
      } satisfies FilterModel<"date", TData>;
    });
  };

  return (
    <Command>
      {/* <CommandInput placeholder={`Cari ${columnMeta.displayName}...`} /> */}
      {/* <CommandEmpty>{messages.empty}</CommandEmpty> */}
      <CommandList className="max-h-fit">
        <CommandGroup>
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={changeDateRange}
            numberOfMonths={1}
          />
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function FilterValueTextController<TData, TValue>({
  column,
  columnMeta,
}: ProperFilterValueMenuProps<TData, TValue>) {
  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterModel<"text", TData>)
    : undefined;
  const filterValue = filter?.values[0] ?? "";

  const [value, setValue] = useState(filterValue);
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    column.setFilterValue((old: undefined | FilterModel<"text", TData>) => {
      if (!old || old.values.length === 0)
        return {
          operator: "contains",
          values: [debouncedValue],
          columnMeta: column.columnDef.meta,
        } satisfies FilterModel<"text", TData>;
      return { operator: old.operator, values: [debouncedValue] };
    });
  }, [column, debouncedValue]);

  return (
    <Command>
      <CommandList className="max-h-fit">
        <CommandGroup>
          <CommandItem>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Cari ${columnMeta.displayName}...`}
              autoFocus
            />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function FilterValueNumberController<TData, TValue>({
  column,
  columnMeta,
}: ProperFilterValueMenuProps<TData, TValue>) {
  const cappedMax = columnMeta.max ?? Number.MAX_SAFE_INTEGER;

  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterModel<"number", TData>)
    : undefined;

  const isNumberRange =
    !!filter && numberFilterDetails[filter.operator].target === "multiple";

  const [datasetMin] = column.getFacetedMinMaxValues() ?? [0, 0];

  const initialValues = () => {
    if (filter?.values)
      return filter.values.map((val) =>
        val >= cappedMax ? `${cappedMax}+` : val.toString(),
      );

    return [datasetMin.toString()];
  };

  const [inputValues, setInputValues] = useState<string[]>(initialValues);

  const changeNumber = (value: number[]) => {
    const sortedValues = [...value].sort((a, b) => a - b);

    column.setFilterValue((old: undefined | FilterModel<"number", TData>) => {
      if (!old || old.values.length === 0)
        return { operator: "is", values: sortedValues };

      const operator = numberFilterDetails[old.operator];
      let newValues: number[];

      if (operator.target === "single") newValues = [sortedValues[0]];
      else {
        newValues = [
          sortedValues[0] >= cappedMax ? cappedMax : sortedValues[0],
          sortedValues[1] >= cappedMax
            ? Number.POSITIVE_INFINITY
            : sortedValues[1],
        ];
      }

      return { operator: old.operator, values: newValues };
    });
  };

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    if (isNumberRange && Number.parseInt(value, 10) >= cappedMax)
      newValues[index] = `${cappedMax}+`;
    else newValues[index] = value;

    setInputValues(newValues);

    const parsedValues = newValues.map((val) => {
      if (val.trim() === "") return 0;
      if (val === `${cappedMax}+`) return cappedMax;
      return Number.parseInt(val, 10);
    });

    changeNumber(parsedValues);
  };

  const changeType = (type: "single" | "range") => {
    column.setFilterValue((old: undefined | FilterModel<"number", TData>) => {
      if (type === "single")
        return { operator: "is", values: [old?.values[0] ?? 0] };

      const newMaxValue = old?.values[0] ?? cappedMax;
      return { operator: "is between", values: [0, newMaxValue] };
    });

    if (type === "single") setInputValues([inputValues[0]]);
    else {
      const maxValue = inputValues[0] || cappedMax.toString();
      setInputValues(["0", maxValue]);
    }
  };

  const slider = {
    value: inputValues.map((val) =>
      val === "" || val === `${cappedMax}+`
        ? cappedMax
        : Number.parseInt(val, 10),
    ),
    onValueChange: (value: number[]) => {
      const values = value.map((val) => (val >= cappedMax ? cappedMax : val));
      setInputValues(
        values.map((v) => (v >= cappedMax ? `${cappedMax}+` : v.toString())),
      );
      changeNumber(values);
    },
  };

  return (
    <Command>
      <CommandList className="w-75 px-2 py-2">
        <CommandGroup>
          <div className="flex w-full flex-col">
            <Tabs
              value={isNumberRange ? "range" : "single"}
              onValueChange={(v) =>
                changeType(v === "range" ? "range" : "single")
              }
            >
              <TabsList className="w-full *:text-xs">
                <TabsTrigger value="single">Single</TabsTrigger>
                <TabsTrigger value="range">Range</TabsTrigger>
              </TabsList>
              <TabsContent value="single" className="mt-4 flex flex-col gap-4">
                <Slider
                  value={[Number(inputValues[0])]}
                  onValueChange={(value) => {
                    handleInputChange(0, value[0].toString());
                  }}
                  min={datasetMin}
                  max={cappedMax}
                  step={1}
                  aria-orientation="horizontal"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Value</span>
                  <Input
                    id="single"
                    type="number"
                    value={inputValues[0]}
                    onChange={(e) => handleInputChange(0, e.target.value)}
                    max={cappedMax}
                  />
                </div>
              </TabsContent>
              <TabsContent value="range" className="mt-4 flex flex-col gap-4">
                <Slider
                  value={slider.value}
                  onValueChange={slider.onValueChange}
                  min={datasetMin}
                  max={cappedMax}
                  step={1}
                  aria-orientation="horizontal"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Min</span>
                    <Input
                      type="number"
                      value={inputValues[0]}
                      onChange={(e) => handleInputChange(0, e.target.value)}
                      max={cappedMax}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Max</span>
                    <Input
                      type="text"
                      value={inputValues[1]}
                      placeholder={`${cappedMax}+`}
                      onChange={(e) => handleInputChange(1, e.target.value)}
                      max={cappedMax}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

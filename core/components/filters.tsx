"use client";

import { useDebounce } from "@/core/hooks/use-debounce";
import { messages } from "@/core/messages";
import {
  createNumberRange,
  DataFilterOption,
  DataFilterType,
  dateFilterDetails,
  determineNewOperator,
  ElementType,
  FilterModel,
  filterTypeOperatorDetails,
  formatDateRange,
  formatLocalizedDate,
  getColumn,
  getColumnMeta,
  isColumnOptionArray,
  isFilterableColumn,
  multiOptionFilterDetails,
  numberFilterDetails,
  optionFilterDetails,
  textFilterDetails,
} from "@/core/utils";
import { formatNumber } from "@/core/utils/formaters";
import { cn } from "@/core/utils/helpers";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { Column, ColumnMeta, RowData, Table } from "@tanstack/react-table";
import { endOfDay, isEqual } from "date-fns";
import {
  ArrowRightIcon,
  EllipsisIcon,
  FilterIcon,
  FilterXIcon,
  RotateCcwSquareIcon,
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
import { Button, ButtonProps } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { InputGroup, InputGroupAddon } from "./ui/input-group";
import { Kbd } from "./ui/kbd";
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuPopup,
  MenuShortcut,
  MenuTrigger,
} from "./ui/menu";
import { Popover, PopoverPopup, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { Tabs, TabsList, TabsPanel, TabsTab } from "./ui/tabs";

export function ActiveFiltersContainer({
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
      return () => resizeObserver.disconnect();
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

export function ClearFilters<TData>({
  table,
  size = "default",
  variant = "destructive-outline",
  ...props
}: Omit<ButtonProps, "onClick"> & { table: Table<TData> }) {
  return (
    <Button
      size={size}
      variant={variant}
      onClick={() => {
        table.setColumnFilters([]);
        table.setGlobalFilter("");
      }}
      {...props}
    >
      <FilterXIcon />
      {!size?.startsWith("icon") && messages.actions.clear}
    </Button>
  );
}

export function ResetFilters<TData>({
  table,
  shortcut,
  size = "default",
  variant = "outline",
  ...props
}: Omit<ButtonProps, "onClick"> & { table: Table<TData>; shortcut?: Hotkey }) {
  const clear = () => {
    table.reset();

    // table.resetPagination();
    // if (dc.defaultState?.page) table.setPageIndex(dc.defaultState.page);
    // else table.resetPageIndex();
    // if (dc.defaultState?.size) table.setPageSize(dc.defaultState.size);
    // else table.resetPageSize();

    table.resetColumnOrder();
    table.resetColumnSizing();
    table.resetColumnVisibility();
    table.resetColumnPinning();
    table.resetColumnFilters();

    table.resetRowPinning();
    table.resetRowSelection();

    table.resetGlobalFilter();
    table.setGlobalFilter("");

    table.resetSorting();
    table.resetGrouping();
    table.resetExpanded();
    table.resetHeaderSizeInfo();
  };

  useHotkey(shortcut ?? "R", () => clear(), { enabled: !!shortcut });

  return (
    <Button size={size} variant={variant} onClick={() => clear()} {...props}>
      <RotateCcwSquareIcon />
      {!size?.startsWith("icon") && messages.actions.reset}
      {shortcut && (
        <Kbd className="hidden text-xs lg:inline-flex">
          {formatForDisplay(shortcut)}
        </Kbd>
      )}
    </Button>
  );
}

export function FilterSelector<TData>({
  table,
  variant = "outline",
  align = "start",
  shortcut,
  size = "default",
  ...props
}: ButtonProps & {
  table: Table<TData>;
  align?: React.ComponentProps<typeof PopoverPopup>["align"];
  shortcut?: Hotkey;
}) {
  const anchor = useRef<HTMLButtonElement>(null);
  const [property, setProperty] = useState<string | undefined>(undefined);

  const [isOpen, setOpen] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useHotkey(shortcut ?? "F", () => setOpen((v) => !v), { enabled: !!shortcut });

  const properties = useMemo(
    () => table.getAllColumns().filter(isFilterableColumn),
    [table],
  );

  const column = property ? getColumn(table, property) : undefined;
  const columnMeta = property ? getColumnMeta(table, property) : undefined;

  const content = useMemo(() => {
    if (!property || !column || !columnMeta) return null;
    return (
      <FitlerValueController
        id={property}
        column={column}
        columnMeta={columnMeta}
        table={table}
      />
    );
  }, [column, columnMeta, property, table]);

  return (
    <>
      <Menu open={isOpen} onOpenChange={setOpen}>
        <MenuTrigger
          render={
            <Button ref={anchor} size={size} variant={variant} {...props}>
              <FilterIcon />
              {!size?.startsWith("icon") && "Filter"}
              {shortcut && (
                <Kbd className="hidden text-xs lg:inline-flex">
                  {formatForDisplay(shortcut)}
                </Kbd>
              )}
            </Button>
          }
        />

        <MenuPopup align={align}>
          {properties.map((column) => {
            const columnType = column.columnDef.meta?.type;
            const Icon = column.columnDef.meta?.icon;
            return (
              <MenuItem
                key={column.id}
                onClick={() => {
                  setProperty(column.id);
                  if (!columnType) return;
                  const setter =
                    columnType === "option" || columnType === "multiOption"
                      ? setIsMenuOpen
                      : setIsPopoverOpen;
                  setTimeout(() => setter(true), 10);
                }}
              >
                {Icon && <Icon />} {column.columnDef.meta?.label}
                <ArrowRightIcon className="opacity-0 group-aria-selected:opacity-100" />
              </MenuItem>
            );
          })}
        </MenuPopup>
      </Menu>

      <Menu
        open={isMenuOpen}
        onOpenChange={(v) => {
          setIsMenuOpen(v);
          if (!v) setProperty(undefined);
        }}
      >
        <MenuPopup anchor={anchor} align={align}>
          {content}
        </MenuPopup>
      </Menu>

      <Popover
        open={isPopoverOpen}
        onOpenChange={(v) => {
          setIsPopoverOpen(v);
          if (!v) setProperty(undefined);
        }}
      >
        <PopoverPopup anchor={anchor} align={align} className="*:p-1">
          {content}
        </PopoverPopup>
      </Popover>
    </>
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
function renderFilter<TData, T extends DataFilterType>(
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
  const Icon = meta.icon;
  return (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-1.5 px-2 font-medium whitespace-nowrap select-none"
    >
      {Icon && <Icon />} {meta.label}
    </Button>
  );
}

/****** Property Filter Operator ******/

// Renders the filter operator display and menu for a given column filter
// The filter operator display is the label and icon for the filter operator
// The filter operator menu is the dropdown menu for the filter operator
export function FilterOperator<TData, T extends DataFilterType>({
  column,
  columnMeta,
  filter,
}: {
  column: Column<TData, unknown>;
  columnMeta: ColumnMeta<TData, unknown>;
  filter: FilterModel<T, TData>;
}) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button size="sm" variant="outline">
            <FilterOperatorDisplay
              filter={filter}
              filterType={columnMeta.type}
            />
          </Button>
        }
      />

      <MenuPopup>
        <FilterOperatorController column={column} />
      </MenuPopup>
    </Menu>
  );
}

export function FilterOperatorDisplay<TData, T extends DataFilterType>({
  filter,
  filterType,
}: {
  filter: FilterModel<T, TData>;
  filterType: T;
}) {
  const details = filterTypeOperatorDetails[filterType][filter.operator];

  return <span>{details.label}</span>;
}

type FilterOperatorControllerProps<TData> = {
  column: Column<TData, unknown>;
};

export function FilterOperatorController<TData>({
  column,
}: FilterOperatorControllerProps<TData>) {
  const { type } = column.columnDef.meta!;

  switch (type) {
    case "text":
      return <FilterOperatorTextController column={column} />;
    case "number":
      return <FilterOperatorNumberController column={column} />;
    case "date":
      return <FilterOperatorDateController column={column} />;
    case "option":
      return <FilterOperatorOptionController column={column} />;
    case "multiOption":
      return <FilterOperatorMultiOptionController column={column} />;
    default:
      return null;
  }
}

export function FilterOperatorTextController<TData>({
  column,
}: FilterOperatorControllerProps<TData>) {
  const filter = column.getFilterValue() as FilterModel<"text", TData>;
  const filterDetails = textFilterDetails[filter.operator];

  const relatedFilters = Object.values(textFilterDetails).filter(
    (o) => o.target === filterDetails.target,
  );

  const changeOperator = (operator: string) =>
    column.setFilterValue((old: typeof filter) => ({ ...old, operator }));

  return relatedFilters.map((r) => (
    <MenuItem key={r.value} onClick={() => changeOperator(r.value)}>
      {r.label}
    </MenuItem>
  ));
}

function FilterOperatorNumberController<TData>({
  column,
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
  };

  return relatedFilters.map((r) => (
    <MenuItem key={r.value} onClick={() => changeOperator(r.value)}>
      {r.label}
    </MenuItem>
  ));
}

function FilterOperatorDateController<TData>({
  column,
}: FilterOperatorControllerProps<TData>) {
  const filter = column.getFilterValue() as FilterModel<"date", TData>;
  const filterDetails = dateFilterDetails[filter.operator];

  const relatedFilters = Object.values(dateFilterDetails).filter(
    (o) => o.target === filterDetails.target,
  );

  const changeOperator = (operator: string) =>
    column.setFilterValue((old: typeof filter) => ({ ...old, operator }));

  return relatedFilters.map((r) => (
    <MenuItem key={r.value} onClick={() => changeOperator(r.value)}>
      {r.label}
    </MenuItem>
  ));
}

function FilterOperatorOptionController<TData>({
  column,
}: FilterOperatorControllerProps<TData>) {
  const filter = column.getFilterValue() as FilterModel<"option", TData>;
  const filterDetails = optionFilterDetails[filter.operator];

  const relatedFilters = Object.values(optionFilterDetails).filter(
    (o) => o.target === filterDetails.target,
  );

  const changeOperator = (operator: string) =>
    column.setFilterValue((old: typeof filter) => ({ ...old, operator }));

  return relatedFilters.map((r) => (
    <MenuItem key={r.value} onClick={() => changeOperator(r.value)}>
      {r.label}
    </MenuItem>
  ));
}

function FilterOperatorMultiOptionController<TData>({
  column,
}: FilterOperatorControllerProps<TData>) {
  const filter = column.getFilterValue() as FilterModel<"multiOption", TData>;
  const filterDetails = multiOptionFilterDetails[filter.operator];

  const relatedFilters = Object.values(multiOptionFilterDetails).filter(
    (o) => o.target === filterDetails.target,
  );

  const changeOperator = (operator: string) =>
    column.setFilterValue((old: typeof filter) => ({ ...old, operator }));

  return relatedFilters.map((r) => (
    <MenuItem key={r.value} onClick={() => changeOperator(r.value)}>
      {r.label}
    </MenuItem>
  ));
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
  const trigger = (
    <Button size="sm" variant="outline">
      <FilterValueDisplay
        id={id}
        column={column}
        columnMeta={columnMeta}
        table={table}
      />
    </Button>
  );

  const content = (
    <FitlerValueController
      id={id}
      column={column}
      columnMeta={columnMeta}
      table={table}
    />
  );

  if (columnMeta.type === "option" || columnMeta.type === "multiOption")
    return (
      <Menu>
        <MenuTrigger render={trigger} />
        <MenuPopup>{content}</MenuPopup>
      </Menu>
    );

  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverPopup className="*:p-1">{content}</PopoverPopup>
    </Popover>
  );
}

type FilterValueDisplayProps<TData, TValue> = {
  id: string;
  column: Column<TData>;
  columnMeta: ColumnMeta<TData, TValue>;
  table: Table<TData>;
};

export function FilterValueDisplay<TData, TValue>({
  id,
  column,
  columnMeta,
  table,
}: FilterValueDisplayProps<TData, TValue>) {
  switch (columnMeta.type) {
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
    case "date":
      return (
        <FilterValueDateDisplay
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
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
    default:
      return null;
  }
}

function uniq<T>(a: T[]): T[] {
  return Array.from(new Set(a));
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
    const formattedDateStr = formatLocalizedDate(value, "MMM d, yyyy");
    return <span>{formattedDateStr}</span>;
  }

  const formattedRangeStr = formatDateRange(filter.values[0], filter.values[1]);

  return <span>{formattedRangeStr}</span>;
}

export function FilterValueOptionDisplay<TData, TValue>({
  id,
  column,
  columnMeta,
  table,
}: FilterValueDisplayProps<TData, TValue>) {
  let options: DataFilterOption[];
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

  // Make sure the column data conforms to DataFilterOption type
  else if (isColumnOptionArray(uniqueVals)) options = uniqueVals;
  // Invalid configuration
  else
    throw new Error(
      `[data-filter] [${id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to DataFilterOption type`,
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

  const name = columnMeta.label.toLowerCase();
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
  let options: DataFilterOption[];
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

  // Make sure the column data conforms to DataFilterOption type
  else if (isColumnOptionArray(uniqueVals)) options = uniqueVals;
  // Invalid configuration
  else {
    throw new Error(
      `[data-filter] [${id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to DataFilterOption type`,
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

  const name = columnMeta.label.toLowerCase();
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
    case "date":
      return (
        <FilterValueDateController
          id={id}
          column={column}
          columnMeta={columnMeta}
          table={table}
        />
      );
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
    default:
      return null;
  }
}

type ProperFilterValueMenuProps<TData, TValue> = {
  id: string;
  column: Column<TData>;
  columnMeta: ColumnMeta<TData, TValue>;
  table: Table<TData>;
};

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

  const onInput = useEffectEvent(() => {
    column.setFilterValue((old: undefined | FilterModel<"text", TData>) => {
      if (!old || old.values.length === 0)
        return {
          operator: "contains",
          values: [debouncedValue],
          columnMeta: column.columnDef.meta,
        } satisfies FilterModel<"text", TData>;
      return { operator: old.operator, values: [debouncedValue] };
    });
  });

  useEffect(() => onInput(), [debouncedValue]);

  const Icon = column.columnDef.meta?.icon;

  return (
    <InputGroup>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Cari ${columnMeta.label}...`}
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
    <div className="flex w-full flex-col">
      <Tabs
        value={isNumberRange ? "range" : "single"}
        onValueChange={(v) => changeType(v === "range" ? "range" : "single")}
      >
        <TabsList className="w-full *:text-xs">
          <TabsTab value="single">Single</TabsTab>
          <TabsTab value="range">Range</TabsTab>
        </TabsList>
        <TabsPanel value="single" className="mt-4 flex flex-col gap-4">
          <Slider
            step={1}
            value={[Number(inputValues[0])]}
            onValueChange={(v) => {
              const value: number = Array.isArray(v) ? v[0] : v;
              if (value >= cappedMax) handleInputChange(0, `${cappedMax}+`);
              else handleInputChange(0, value.toString());
            }}
            min={datasetMin}
            max={cappedMax}
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
        </TabsPanel>
        <TabsPanel value="range" className="mt-4 flex flex-col gap-4">
          <Slider
            step={1}
            value={slider.value}
            onValueChange={(v) => {
              const value: number = Array.isArray(v) ? v[0] : v;
              if (value >= cappedMax) handleInputChange(0, `${cappedMax}+`);
              else handleInputChange(0, value.toString());
            }}
            min={datasetMin}
            max={cappedMax}
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
        </TabsPanel>
      </Tabs>
    </div>
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
    <Calendar
      mode="range"
      defaultMonth={date?.from}
      selected={date}
      onSelect={changeDateRange}
      numberOfMonths={1}
    />
  );
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

  let options: DataFilterOption[];
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

  // Make sure the column data conforms to DataFilterOption type
  else if (isColumnOptionArray(uniqueVals)) options = uniqueVals;
  // Invalid configuration
  else {
    throw new Error(
      `[data-filter] [${id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to DataFilterOption type`,
    );
  }

  const optionsCount: Record<DataFilterOption["value"], number> =
    columnVals.reduce(
      (acc, curr) => {
        const { value } = columnMeta.transformOptionFn
          ? columnMeta.transformOptionFn(
              curr as ElementType<NonNullable<TValue>>,
            )
          : { value: curr as string };

        acc[value] = (acc[value] ?? 0) + 1;
        return acc;
      },
      {} as Record<DataFilterOption["value"], number>,
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

  return options.map(({ value, label, icon: Icon, count }) => {
    const checked = Boolean(filter?.values.includes(value));
    return (
      <MenuCheckboxItem
        key={value}
        checked={checked}
        onCheckedChange={() => handleOptionSelect(value, !checked)}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {Icon &&
              (isValidElement(Icon) ? (
                Icon
              ) : (
                <Icon className="text-muted-foreground" />
              ))}
            {label}
          </div>
          <MenuShortcut
            className={cn(
              "ml-auto tracking-tight tabular-nums",
              count === 0 && "slashed-zero",
            )}
          >
            {formatNumber(count ?? optionsCount[value] ?? 0)}
          </MenuShortcut>
        </div>
      </MenuCheckboxItem>
    );
  });
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

  let options: DataFilterOption[];
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

  // Make sure the column data conforms to DataFilterOption type
  else if (isColumnOptionArray(uniqueVals)) options = uniqueVals;
  // Invalid configuration
  else {
    throw new Error(
      `[data-filter] [${id}] Either provide static options, a transformOptionFn, or ensure the column data conforms to DataFilterOption type`,
    );
  }

  const optionsCount: Record<DataFilterOption["value"], number> =
    columnVals.reduce(
      (acc, curr) => {
        const value = columnMeta.options
          ? (curr as string)
          : columnMeta.transformOptionFn!(
              curr as ElementType<NonNullable<TValue>>,
            ).value;

        acc[value] = (acc[value] ?? 0) + 1;
        return acc;
      },
      {} as Record<DataFilterOption["value"], number>,
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

  return options.map(({ value, label, icon: Icon, count }) => {
    const checked = Boolean(filter?.values[0]?.includes(value));
    return (
      <MenuCheckboxItem
        key={value}
        checked={checked}
        onCheckedChange={() => handleOptionSelect(value, !checked)}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {Icon &&
              (isValidElement(Icon) ? (
                Icon
              ) : (
                <Icon className="text-muted-foreground" />
              ))}
            {label}
          </div>
          <MenuShortcut
            className={cn(
              "ml-auto tracking-tight tabular-nums",
              count === 0 && "slashed-zero",
            )}
          >
            {formatNumber(count ?? optionsCount[value] ?? 0)}
          </MenuShortcut>
        </div>
      </MenuCheckboxItem>
    );
  });
}

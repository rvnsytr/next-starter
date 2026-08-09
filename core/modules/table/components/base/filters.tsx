"use client";

import { Button, ButtonProps } from "@/core/components/ui/button";
import { ButtonGroup } from "@/core/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuShortcut,
  MenuTrigger,
} from "@/core/components/ui/menu";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { useDebounce } from "@/core/hooks/use-debounce";
import {
  filterMeta,
  FilterPopupType,
  FilterValue,
} from "@/core/modules/table/filters";
import {
  filterValueSchema,
  stringFilterValueSchema,
} from "@/core/modules/table/schema";
import { DataTableType } from "@/core/modules/table/types";
import { getFilterOperators, getTableHook } from "@/core/modules/table/utils";
import { cn } from "@/core/utils";
import { ErrorFallback } from "@/shared/components/fallback";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import {
  ChevronRightIcon,
  EllipsisIcon,
  FilterIcon,
  FilterXIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TableTypeProp = { tableType: DataTableType };

export type FilterSelectorProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "F" */
  shortcut?: "default" | Hotkey;
};

type FilterSelectorState = {
  columnId: string;
  filterType: FilterValue["type"];
  popupType: FilterPopupType;
} | null;

const FILTERS_DEFAULT_HOTKEY: Hotkey = "F";
const ANIMATION_DELAY = 50;

export function FilterSelector({
  tableType,
  shortcut,
  align = "center",
  size = "default",
  variant = "outline",
  children,
  ...props
}: TableTypeProp & FilterSelectorProps) {
  const table = getTableHook(tableType).useTableContext();

  const anchor = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterSelector, setFilterSelector] =
    useState<FilterSelectorState>(null);

  const hotkey = shortcut === "default" ? FILTERS_DEFAULT_HOTKEY : shortcut;
  useHotkey(
    hotkey ?? FILTERS_DEFAULT_HOTKEY,
    () => setIsOpen((prev) => !prev),
    { enabled: !!hotkey },
  );

  const columnFilterIds = table.atoms.columnFilters.get().map((c) => c.id);

  return (
    <>
      <Menu
        open={isOpen}
        onOpenChange={(v) => {
          setIsOpen(v);
          if (!v) setTimeout(() => setFilterSelector(null), ANIMATION_DELAY);
        }}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <MenuTrigger
                render={
                  <Button ref={anchor} size={size} variant={variant} {...props}>
                    {children ?? (
                      <>
                        <FilterIcon /> Filter
                      </>
                    )}
                  </Button>
                }
              />
            }
          />

          <TooltipPopup align={align}>
            Filter Columns
            {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
          </TooltipPopup>
        </Tooltip>

        <MenuPopup align={align}>
          {filterSelector?.popupType === "menu" ? (
            <FilterValueController tableType={tableType} {...filterSelector} />
          ) : (
            table
              .getAllColumns()
              .filter((column) => column.getCanFilter())
              .map((column) => {
                const { filterFn, meta } = column.columnDef;

                const Icon = meta?.icon;
                const columnId = column.id;

                let filterType: FilterValue["type"] = "string";
                if (typeof filterFn === "string" && filterFn !== "auto")
                  filterType = filterFn;

                const popupType = filterMeta[filterType].popupType;

                return (
                  <MenuItem
                    key={columnId}
                    id={`filter-btn-${columnId}`}
                    onClick={() => {
                      if (popupType === "popover") setIsOpen(false);
                      setTimeout(() => {
                        setFilterSelector({ columnId, filterType, popupType });
                      }, ANIMATION_DELAY);
                    }}
                    closeOnClick={false}
                    disabled={columnFilterIds.includes(column.id)}
                  >
                    {Icon && <Icon className="text-muted-foreground" />}
                    {meta?.label ?? columnId}
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
        open={filterSelector?.popupType === "popover"}
        onOpenChange={(v) => {
          if (!v) setFilterSelector(null);
        }}
      >
        <PopoverPopup
          anchor={anchor}
          align={align}
          className="rounded-xl *:p-1"
        >
          {filterSelector ? (
            <FilterValueController tableType={tableType} {...filterSelector} />
          ) : (
            <ErrorFallback error="Invalid Filter Selector State" hideCode />
          )}
        </PopoverPopup>
      </Popover>
    </>
  );
}

type FilterValueControllerProps = TableTypeProp & { columnId: string };

function FilterValueController({
  filterType,
  ...props
}: FilterValueControllerProps & { filterType: FilterValue["type"] }) {
  switch (filterType) {
    case "string":
      return <FilterValueControllerString {...props} />;
    default:
      return <FilterValueControllerString {...props} />;
  }
}

function FilterValueControllerString({
  tableType,
  columnId,
}: FilterValueControllerProps) {
  const table = getTableHook(tableType).useTableContext();
  const column = table.getColumn(columnId);

  const filterValue = stringFilterValueSchema
    .default(filterMeta.string.defaultValue)
    .catch(filterMeta.string.defaultValue)
    .parse(column?.getFilterValue());

  const defaultValue =
    typeof filterValue.value === "string" ? filterValue.value : "";

  const [value, setValue] = useState<string>(defaultValue);
  const debouncedSearch = useDebounce(value);

  useEffect(() => {
    if (!column) return;

    const columnFilterValue: FilterValue = {
      type: "string",
      operator: filterValue.operator,
      value: debouncedSearch,
    };

    column.setFilterValue(columnFilterValue);
  }, [column, filterValue.operator, debouncedSearch]);

  if (!column)
    return <ErrorFallback error={`Invalid Column Id: ${columnId}`} hideCode />;

  const columnMeta = column.columnDef.meta;
  const Icon = columnMeta?.icon;

  return (
    <InputGroup>
      <InputGroupInput
        value={value}
        onChange={(e) => {
          console.log(e.target.value);
          setValue(String(e.target.value));
        }}
        placeholder={`Search ${columnMeta?.label?.toLowerCase()}...`}
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
  tableType,
  className,
  ...props
}: TableTypeProp & ActiveFiltersProps) {
  const table = getTableHook(tableType).useTableContext();
  const filters = table.atoms.columnFilters.get();
  return filters.map((f) => {
    const key = `filter-${f.id}`;
    const column = table.getColumn(f.id);

    const filterValueResult = filterValueSchema.safeParse(f.value);

    if (!column || !filterValueResult.success) {
      let errorContent = "";

      if (!column) errorContent = `Invalid Column Id: ${f.id}`;
      if (!filterValueResult.success)
        errorContent = `Invalid Filter Value: ${JSON.stringify(f.value)}`;

      return (
        <Button
          key={key}
          size="sm"
          variant="destructive-outline"
          className="disabled:opacity-100"
          disabled
        >
          {errorContent}
        </Button>
      );
    }

    const filterValue = filterValueResult.data;
    const popupType = filterMeta[filterValue.type].popupType;

    const operators = getFilterOperators(filterValue.type);
    const selectedOperatorLabel =
      operators.find((op) => op.value === filterValue.operator)?.label ??
      filterValue.operator;

    const columnMeta = column.columnDef.meta;
    const Icon = columnMeta?.icon;

    return (
      <ButtonGroup key={key} className={cn("**:text-xs", className)} {...props}>
        <Button
          size="sm"
          variant="outline"
          className="disabled:opacity-100"
          disabled
        >
          {Icon && <Icon />}
          {columnMeta?.label ?? column.id}
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
                  column.setFilterValue({ ...filterValue, operator: op.value });
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
          filterValue={filterValue}
          popupType={popupType}
        >
          <FilterValueController
            tableType={tableType}
            columnId={column.id}
            filterType={filterValue.type}
          />
        </FilterValueDisplayPopup>

        <Button
          size="icon-sm"
          variant="destructive-outline"
          onClick={() => column.setFilterValue(undefined)}
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

  if (!withValue) return;

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
      <PopoverPopup className="rounded-xl *:p-1">{children}</PopoverPopup>
    </Popover>
  );
}

type FilterValueDisplayProps<T extends FilterValue["type"]> = Pick<
  Extract<FilterValue, { type: T }>,
  "value"
>;

function FilterValueDisplay({ filterValue }: { filterValue: FilterValue }) {
  switch (filterValue.type) {
    case "string":
      return <FilterValueDisplayString value={filterValue.value} />;
    default:
      return JSON.stringify(filterValue.value);
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

export type ClearFiltersProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export function ClearFilters({
  tableType,
  align,
  size = "sm",
  variant = "destructive-outline",
  onClick,
  children,
  ...props
}: TableTypeProp & ClearFiltersProps) {
  const table = getTableHook(tableType).useTableContext();
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={size}
            variant={variant}
            onClick={(e) => {
              table.setColumnFilters([]);
              table.setGlobalFilter("");
              onClick?.(e);
            }}
            {...props}
          >
            {children ?? (
              <>
                <FilterXIcon /> Clear
              </>
            )}
          </Button>
        }
      />
      <TooltipPopup align={align}>Clear All Filters</TooltipPopup>
    </Tooltip>
  );
}

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
} from "@/core/modules/table/filters";
import { filterValueSchema } from "@/core/modules/table/schema";
import { DataTableType } from "@/core/modules/table/types";
import { getFilterOperators, getTableHook } from "@/core/modules/table/utils";
import { cn } from "@/core/utils";
import { ErrorFallback } from "@/shared/components/fallback";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { ChevronRightIcon, FilterIcon, XIcon } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type TableTypeProp = { tableType: DataTableType };

export type FilterSelectorProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "F" */
  shortcut?: "default" | Hotkey;
};

type FilterSelectorState = {
  columnId: string;
  filterType: FilterType;
  popupType: FilterPopupType;
} | null;

const FILTERS_DEFAULT_HOTKEY: Hotkey = "F";
const ANIMATION_DELAY = 50;

export function FilterSelector({
  tableType,
  shortcut,
  align = "center",
  size,
  variant = "outline",
  children,
  ...props
}: FilterSelectorProps & TableTypeProp) {
  const table = getTableHook(tableType).useTableContext();

  const anchor = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterSelector, setFilterSelector] =
    useState<FilterSelectorState>(null);

  const buttonSize: ButtonProps["size"] =
    size ?? (children ? "default" : "icon");
  const isIconSize = buttonSize.startsWith("icon");

  const hotkey = shortcut === "default" ? FILTERS_DEFAULT_HOTKEY : shortcut;
  useHotkey(
    hotkey ?? FILTERS_DEFAULT_HOTKEY,
    () => setIsOpen((prev) => !prev),
    { enabled: !!hotkey },
  );

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
                  <Button
                    ref={anchor}
                    size={buttonSize}
                    variant={variant}
                    {...props}
                  >
                    {children ?? (isIconSize && <FilterIcon />)}
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

                let filterType: FilterType = "string";
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
        <PopoverPopup anchor={anchor} align={align} className="*:p-1">
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
}: FilterValueControllerProps & { filterType: FilterType }) {
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

  const filterValue = filterValueSchema
    .default(filterMeta.string.defaultValue)
    .catch(filterMeta.string.defaultValue)
    .parse(column?.getFilterValue());

  const defaultValue =
    typeof filterValue.value === "string" ? filterValue.value : "";
  const [value, setValue] = useState<string>(defaultValue);
  const debouncedSearch = useDebounce(value);

  useEffect(() => {
    if (!column) return;
    if (!debouncedSearch) return column.setFilterValue(undefined);

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

export type ActiveFiltersProps = React.ComponentProps<typeof ButtonGroup>;

export function ActiveFilters({
  tableType,
  className,
  ...props
}: ActiveFiltersProps & TableTypeProp) {
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

        <FilterOperatorSelector
          size="sm"
          variant="outline"
          filterValue={filterValue}
          onOperatorChange={(newOperator) =>
            column.setFilterValue({ ...filterValue, operator: newOperator })
          }
        />

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

type FilterOperatorSelectorProps = Omit<ButtonProps, "children"> & {
  filterValue: FilterValue;
  onOperatorChange: (newOperator: FilterValue["operator"]) => void;
};

function FilterOperatorSelector({
  filterValue,
  onOperatorChange,
  ...props
}: FilterOperatorSelectorProps) {
  const operators = useMemo(
    () => getFilterOperators(filterValue.type),
    [filterValue.type],
  );

  const selectedOperator = operators.find(
    (op) => op.value === filterValue.operator,
  );

  const label = selectedOperator?.label ?? filterValue.operator;

  return (
    <Menu>
      <MenuTrigger render={<Button {...props}>{label}</Button>} />
      <MenuPopup>
        {operators.map((op) => (
          <MenuItem key={op.value} onClick={() => onOperatorChange(op.value)}>
            {op.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  );
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
      <PopoverPopup className="*:p-1">{children}</PopoverPopup>
    </Popover>
  );
}

type FilterValueDisplayProps<T extends FilterType> = Pick<
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
      : (value ?? "...");
  return displayValue;
}

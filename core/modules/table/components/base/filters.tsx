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
import { getTableHook } from "@/core/modules/table/utils";
import { cn } from "@/core/utils";
import { ErrorFallback } from "@/shared/components/fallback";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { ChevronRightIcon, FilterIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type TableTypeProp = { tableType: DataTableType };

export type FilterSelectorProps = ButtonProps & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "F" */
  shortcut?: "default" | Hotkey;
};

type FilterSelectorState = {
  filterType: FilterType;
  popupType: FilterPopupType;
  columnId: string;
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
            <FilterController tableType={tableType} {...filterSelector} />
          ) : (
            <FilterSelectorItems
              tableType={tableType}
              setIsMenuOpen={setIsOpen}
              setFilterSelector={setFilterSelector}
            />
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
            <FilterController tableType={tableType} {...filterSelector} />
          ) : (
            <ErrorFallback error="Invalid Filter Selector State" hideCode />
          )}
        </PopoverPopup>
      </Popover>
    </>
  );
}

function FilterSelectorItems({
  tableType,
  setIsMenuOpen,
  setFilterSelector,
}: TableTypeProp & {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterSelector: React.Dispatch<React.SetStateAction<FilterSelectorState>>;
}) {
  const table = getTableHook(tableType).useTableContext();

  return table
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
            if (popupType === "popover") setIsMenuOpen(false);
            setTimeout(
              () => setFilterSelector({ filterType, popupType, columnId }),
              ANIMATION_DELAY,
            );
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
    });
}

type FilterControllerProps = TableTypeProp & { columnId: string };

function FilterController({
  filterType,
  ...props
}: FilterControllerProps & { filterType: FilterType }) {
  switch (filterType) {
    case "string":
      return <FilterControllerString {...props} />;
    default:
      return <FilterControllerString {...props} />;
  }
}

function FilterControllerString({
  tableType,
  columnId,
}: FilterControllerProps) {
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
      value: debouncedSearch,
    };

    column.setFilterValue(columnFilterValue);
  }, [column, debouncedSearch]);

  if (!column) return <ErrorFallback error="Invalid Column Id" hideCode />;

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

        {/* <FilterOperator column={column} columnMeta={meta} filter={value} /> */}
        {/* <FilterValue id={id} column={column} columnMeta={meta} table={table} /> */}

        <FilterValueController
          tableType={tableType}
          filterValue={filterValue}
          popupType={popupType}
          columnId={column.id}
          size="sm"
          variant="outline"
        />

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

type FilterControllerWrapperProps = Omit<ButtonProps, "children"> &
  TableTypeProp & {
    filterValue: FilterValue;
    popupType: FilterPopupType;
    columnId: string;
  };

function FilterValueController({
  tableType,
  filterValue,
  popupType,
  columnId,
  ...props
}: FilterControllerWrapperProps) {
  const trigger = (
    <Button {...props}>
      <FilterValueDisplay filterValue={filterValue} />
    </Button>
  );

  const filterController = (
    <FilterController
      tableType={tableType}
      filterType={filterValue.type}
      columnId={columnId}
    />
  );

  if (popupType === "menu")
    return (
      <Menu>
        <MenuTrigger render={trigger} />
        <MenuPopup>{filterController}</MenuPopup>
      </Menu>
    );

  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverPopup className="*:p-1">{filterController}</PopoverPopup>
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
      : value;
  return displayValue;
}

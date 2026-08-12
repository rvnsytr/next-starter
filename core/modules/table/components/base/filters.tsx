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
  FilterPopupType,
  FilterType,
  FilterValue,
} from "@/core/modules/table/filters";
import { ColumnMeta } from "@/core/modules/table/types";
import { getFilterOperators } from "@/core/modules/table/utils";
import { cn } from "@/core/utils";
import { ErrorFallback } from "@/shared/components/fallback";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import {
  ChevronRightIcon,
  EllipsisIcon,
  FilterIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type FilterSelectorProps = Omit<ButtonProps, "children"> & {
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
  /** @default "F" */
  shortcut?: "default" | Hotkey;

  renderTrigger?: React.ReactElement;
};

type FilterValueControllerProps = {
  id: string;
  filterValue: FilterValue;
  setFilter: (updater: FilterValue | undefined) => void;
  columnMeta?: ColumnMeta;
  popupType: FilterPopupType;
};

type FilterSelectorContext = {
  columnFilterIds: Set<string>;
  columns: (
    | ({ success: true } & FilterValueControllerProps)
    | { success: false; id: string }
  )[];
};

const FILTERS_DEFAULT_HOTKEY: Hotkey = "F";
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
            {hotkey && <Kbd className="ml-1">{formatForDisplay(hotkey)}</Kbd>}
          </TooltipPopup>
        </Tooltip>

        <MenuPopup align={align}>
          {filterValueController?.popupType === "menu" ? (
            <FilterValueController {...filterValueController} />
          ) : (
            context.columns.map((column) => {
              if (!column.success) {
                return (
                  <MenuItem key={column.id}>
                    Invalid Filter: {column.id}
                  </MenuItem>
                );
              }

              const Icon = column.columnMeta?.icon;
              return (
                <MenuItem
                  key={column.id}
                  onClick={() => {
                    if (column.popupType === "popover") setIsOpen(false);
                    setTimeout(
                      () => setFilterValueController(column),
                      ANIMATION_DELAY,
                    );
                  }}
                  disabled={context.columnFilterIds.has(column.id)}
                  closeOnClick={false}
                >
                  {Icon && <Icon className="text-muted-foreground" />}
                  {column.columnMeta?.label ?? column.id}
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
          className="rounded-xl *:p-1"
        >
          {filterValueController ? (
            <FilterValueController {...filterValueController} />
          ) : (
            <ErrorFallback error="Invalid Filter Selector State" hideCode />
          )}
        </PopoverPopup>
      </Popover>
    </>
  );
}

function FilterValueController(props: FilterValueControllerProps) {
  switch (props.filterValue.type) {
    case "string":
      return <FilterValueControllerString {...props} />;
    default: {
      const error = `Unsupported Filter Type: ${props.filterValue.type}`;
      return <ErrorFallback error={error} />;
    }
  }
}

function FilterValueControllerString({
  filterValue,
  columnMeta,
  setFilter,
}: FilterValueControllerProps) {
  const filterType: FilterType = "string";

  const isFilterValueValid = filterValue.type === filterType;
  const defaultValue = isFilterValueValid ? filterValue.value : "";

  const [value, setValue] = useState<string>(defaultValue);
  const debouncedSearch = useDebounce(value);

  useEffect(() => {
    if (!isFilterValueValid) return;
    setFilter({
      type: filterType,
      operator: filterValue.operator,
      value: debouncedSearch,
    });
  }, [debouncedSearch, isFilterValueValid, filterValue.operator, setFilter]);

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
  contexts,
  className,
  ...props
}: ActiveFiltersProps & {
  contexts: (
    | ({ success: true } & FilterValueControllerProps)
    | {
        success: false;
        id: string;
        type: "column" | "validation";
        message?: string;
        error?: unknown;
      }
  )[];
}) {
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
          <TooltipTrigger>{button}</TooltipTrigger>
          <TooltipPopup className="text-destructive">
            <pre>{JSON.stringify(c.error, null, 2)}</pre>
          </TooltipPopup>
        </Tooltip>
      );
    }

    console.log(c);

    const operators = getFilterOperators(c.filterValue.type);
    const selectedOperatorLabel =
      operators.find((op) => op.value === c.filterValue.operator)?.label ??
      c.filterValue.operator;

    const Icon = c.columnMeta?.icon;

    return (
      <ButtonGroup
        key={c.id}
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
          {c.columnMeta?.label ?? c.id}
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
                  c.setFilter({ ...c.filterValue, operator: op.value });
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
  return !!displayValue ? displayValue : <EllipsisIcon />;
}

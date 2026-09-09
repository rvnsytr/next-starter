import { Button, ButtonProps } from "@/core/components/ui/button";
import { Kbd } from "@/core/components/ui/kbd";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuShortcut,
  MenuTrigger,
} from "@/core/components/ui/menu";
import { Popover, PopoverPopup } from "@/core/components/ui/popover";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { ColumnFilterContext } from "@/core/modules/table/types";
import { ErrorFallback } from "@/shared/components/fallback";
import {
  formatForDisplay,
  HotkeySequence,
  useHotkeySequence,
} from "@tanstack/react-hotkeys";
import { ChevronRightIcon, FilterIcon } from "lucide-react";
import { useRef, useState } from "react";
import {
  FilterValueController,
  FilterValueControllerProps,
} from "./filter-value-controller";

type FilterSelectorContext = {
  columnFilterIds: Set<string>;
  columns: ColumnFilterContext[];
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

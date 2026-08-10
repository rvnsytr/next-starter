"use client";

import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/core/components/ui/menu";
import { TooltipPopup } from "@/core/components/ui/tooltip";
import { SORT_ICONS } from "@/core/modules/table/constants";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import { cn } from "@/core/utils";
import { ColumnPinningPosition, SortDirection } from "@tanstack/react-table";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  PinIcon,
} from "lucide-react";

export type HeaderProps = Omit<
  React.ComponentProps<typeof MenuTrigger>,
  "children"
> & {
  label: string;
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export function Header({
  tableType,
  label,
  align = "start",
  className,
  ...props
}: HeaderProps & { tableType: DataTableType }) {
  const tableHook = getTableHook(tableType);

  const table = tableHook.useTableContext();
  const { column } = tableHook.useHeaderContext();

  const canSort = column.getCanSort();
  const canPin = column.getCanPin();

  if (!canSort && !canPin) return label;

  const columnId = column.id;

  return (
    <table.Subscribe
      selector={(
        s,
      ): {
        sortDirection: SortDirection | false;
        pinPosition: ColumnPinningPosition;
      } => {
        const sort = s.sorting.find((cs) => cs.id === columnId);
        const isPinStart = s.columnPinning.start?.includes(columnId);
        const isPinEnd = s.columnPinning.end?.includes(columnId);
        return {
          sortDirection: sort ? (sort.desc ? "desc" : "asc") : false,
          pinPosition: isPinStart ? "start" : isPinEnd ? "end" : false,
        };
      }}
    >
      {({ sortDirection, pinPosition }) => {
        const { asc: AscIcon, desc: DescIcon } = SORT_ICONS;

        const SortIcon = sortDirection
          ? SORT_ICONS[sortDirection]
          : SORT_ICONS.default;

        const popupAlign =
          pinPosition === "start"
            ? "start"
            : pinPosition === "end"
              ? "end"
              : align;

        const ColumnIcon = column.columnDef.meta?.icon ?? null;
        const TriggerIcon = canSort ? SortIcon : PinIcon;

        return (
          <Menu>
            <div
              className={cn(
                !props.render && "flex w-full",
                !props.render &&
                  (align === "start"
                    ? "justify-start"
                    : align === "center"
                      ? "justify-center"
                      : "justify-end"),
              )}
            >
              <MenuTrigger
                className={cn(
                  "hover:text-foreground flex cursor-pointer items-center gap-2 transition-colors *:[svg]:size-3.5",
                  className,
                )}
                {...props}
              >
                {ColumnIcon && <ColumnIcon />} {label} <TriggerIcon />
              </MenuTrigger>
            </div>

            <MenuPopup align={popupAlign}>
              {canSort && (
                <MenuGroup>
                  <MenuGroupLabel>Sort Column</MenuGroupLabel>

                  <MenuRadioGroup
                    value={sortDirection || "default"}
                    onValueChange={(v) => {
                      if (v === "default" || sortDirection === v)
                        column.clearSorting();
                      else column.toggleSorting(v === "desc", true);
                    }}
                  >
                    <MenuRadioItem value="asc">
                      <div className="flex items-center gap-2">
                        <AscIcon /> Ascending
                      </div>
                    </MenuRadioItem>

                    <MenuRadioItem value="desc">
                      <div className="flex items-center gap-2">
                        <DescIcon /> Descending
                      </div>
                    </MenuRadioItem>
                  </MenuRadioGroup>
                </MenuGroup>
              )}

              {canSort && canPin && <MenuSeparator />}

              {canPin && (
                <MenuGroup>
                  <MenuGroupLabel>Pin Column</MenuGroupLabel>

                  <MenuRadioGroup
                    value={pinPosition || "default"}
                    onValueChange={(v) => {
                      if (v === "default" || pinPosition === v)
                        column.pin(false);
                      else column.pin(v as "start" | "end");
                    }}
                  >
                    <MenuRadioItem value="start">
                      <div className="flex items-center gap-2">
                        <ArrowLeftToLineIcon />
                        Pin to left
                      </div>
                    </MenuRadioItem>

                    <MenuRadioItem value="end">
                      <div className="flex items-center gap-2">
                        <ArrowRightToLineIcon />
                        Pin to right
                      </div>
                    </MenuRadioItem>
                  </MenuRadioGroup>
                </MenuGroup>
              )}
            </MenuPopup>
          </Menu>
        );
      }}
    </table.Subscribe>
  );
}

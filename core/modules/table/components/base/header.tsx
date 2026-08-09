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
  const header = getTableHook(tableType).useHeaderContext();

  // if (!header.column.getCanPin()) return null;
  const canSort = header.column.getCanSort();
  const canPin = header.column.getCanPin();

  if (!canSort && !canPin) return label;

  const sortDirection = header.column.getIsSorted();
  const { asc: AscIcon, desc: DescIcon } = SORT_ICONS;
  const SortIcon = sortDirection
    ? SORT_ICONS[sortDirection]
    : SORT_ICONS.default;

  const pinPosition = header.column.getIsPinned();
  const popupAlign =
    pinPosition === "start" ? "start" : pinPosition === "end" ? "end" : align;

  const ColumnIcon = header.column.columnDef.meta?.icon ?? null;
  const TriggerIcon = canSort ? SortIcon : PinIcon;

  return (
    <Menu>
      <MenuTrigger
        className={cn(
          !props.render &&
            "hover:text-foreground flex w-full cursor-pointer items-center gap-2 transition-colors",

          !props.render &&
            (align === "start"
              ? "justify-start"
              : align === "center"
                ? "justify-center"
                : "justify-end"),

          "*:[svg]:size-3.5",
          className,
        )}
        {...props}
      >
        {ColumnIcon && <ColumnIcon />} {label} <TriggerIcon />
      </MenuTrigger>

      <MenuPopup align={popupAlign}>
        {canSort && (
          <MenuGroup>
            <MenuGroupLabel>Sort Column</MenuGroupLabel>

            <MenuRadioGroup
              value={sortDirection ?? "default"}
              onValueChange={(v) => {
                if (v === "default" || sortDirection === v)
                  header.column.clearSorting();
                else header.column.toggleSorting(v === "desc", true);
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
              value={pinPosition ?? "default"}
              onValueChange={(v) => {
                if (v === "default" || pinPosition === v)
                  header.column.pin(false);
                else header.column.pin(v as "start" | "end");
              }}
            >
              <MenuRadioItem value="start">
                <div className="flex items-center gap-2">
                  <ArrowLeftToLineIcon /> Pin to left
                </div>
              </MenuRadioItem>
              <MenuRadioItem value="end">
                <div className="flex items-center gap-2">
                  <ArrowRightToLineIcon /> Pin to right
                </div>
              </MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        )}
      </MenuPopup>
    </Menu>
  );
}

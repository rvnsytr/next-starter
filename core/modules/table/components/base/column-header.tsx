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
import { ColumnMeta } from "@/core/modules/table/types";
import { cn } from "@/core/utils";
import { ColumnPinningPosition, SortDirection } from "@tanstack/react-table";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  PinIcon,
} from "lucide-react";

export type ColumnHeaderProps = Omit<
  React.ComponentProps<typeof MenuTrigger>,
  "children"
> & {
  label: string;
  align?: React.ComponentProps<typeof TooltipPopup>["align"];
};

export type ColumnHeaderState = {
  sortDirection: SortDirection | false;
  pinPosition: ColumnPinningPosition;
};

type RadioGroupControlProps = Pick<
  React.ComponentProps<typeof MenuRadioGroup>,
  "value" | "onValueChange"
>;

type ColumnHeaderContext = {
  state: ColumnHeaderState;
  column: {
    id: string;
    meta?: ColumnMeta;
    canSort: boolean;
    canPin: boolean;
    sortControl: RadioGroupControlProps;
    pinControl: RadioGroupControlProps;
  };
};

export function ColumnHeader({
  context,
  label,
  align = "start",
  className,
  ...props
}: ColumnHeaderProps & { context: ColumnHeaderContext }) {
  if (!context.column.canSort && !context.column.canPin) return label;

  const { asc: AscIcon, desc: DescIcon } = SORT_ICONS;

  const SortIcon = context.state.sortDirection
    ? SORT_ICONS[context.state.sortDirection]
    : SORT_ICONS.default;

  const popupAlign =
    context.state.pinPosition === "start"
      ? "start"
      : context.state.pinPosition === "end"
        ? "end"
        : align;

  const ColumnIcon = context.column.meta?.icon ?? null;
  const TriggerIcon = context.column.canSort ? SortIcon : PinIcon;

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
        {context.column.canSort && (
          <MenuGroup>
            <MenuGroupLabel>Sort Column</MenuGroupLabel>

            <MenuRadioGroup {...context.column.sortControl}>
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

        {context.column.canSort && context.column.canPin && <MenuSeparator />}

        {context.column.canPin && (
          <MenuGroup>
            <MenuGroupLabel>Pin Column</MenuGroupLabel>

            <MenuRadioGroup {...context.column.pinControl}>
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
}

"use client";

import { formatLocalizedDate } from "@/core/utils/date";
import { cn } from "@/core/utils/helpers";
import { id } from "date-fns/locale";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { buttonVariants } from "./button";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "./select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  locale = id,
  captionLayout = "dropdown",
  showOutsideDays = true,
  formatters,
  className,
  classNames,
  components: userComponents,
  ...props
}: CalendarProps) {
  const defaultClassNames = {
    button_previous: cn(
      buttonVariants({ size: "icon", variant: "ghost" }),
      "z-10 aria-disabled:opacity-50",
    ),
    button_next: cn(
      buttonVariants({ size: "icon", variant: "ghost" }),
      "z-10 aria-disabled:opacity-50",
    ),
    caption_label: "text-sm font-medium flex items-center gap-2 h-full",
    day: "size-(--cell-size) text-sm py-px",
    day_button: cn(
      buttonVariants({ size: "icon", variant: "ghost" }),
      "in-data-disabled:pointer-events-none in-[.range-middle]:rounded-none in-[.range-end:not(.range-start)]:rounded-s-none in-[.range-start:not(.range-end)]:rounded-e-none in-[.range-middle]:in-data-selected:bg-accent in-data-selected:bg-primary in-[.range-middle]:in-data-selected:text-foreground in-data-disabled:text-muted-foreground/72 in-data-outside:text-muted-foreground/72 in-data-selected:in-data-outside:text-primary-foreground in-data-selected:text-primary-foreground in-data-disabled:line-through outline-none in-[[data-selected]:not(.range-middle)]:transition-[color,background-color,border-radius,box-shadow] focus-visible:z-1 focus-visible:ring-[3px] focus-visible:ring-ring/50",
    ),
    dropdown: "absolute bg-popover inset-0 opacity-0",
    dropdown_root:
      "relative has-focus:border-ring has-focus:ring-ring/50 has-focus:ring-[3px] border border-input shadow-xs/5 rounded-lg px-[calc(--spacing(3)-1px)] h-8 **:[svg:not([class*='opacity-'])]:opacity-80 **:[svg:not([class*='size-'])]:size-4 **:[svg]:pointer-events-none **:[svg]:-me-1",
    dropdowns:
      "w-full flex items-center text-sm justify-center h-(--cell-size) gap-1.5 *:[span]:font-medium",
    hidden: "invisible",
    month: "w-full",
    month_caption:
      "relative mx-(--cell-size) px-1 mb-1 flex h-(--cell-size) items-center justify-center z-2",
    months: "relative flex flex-col sm:flex-row gap-2",
    nav: "absolute top-0 flex w-full justify-between z-1",
    outside:
      "text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground",
    range_end: "range-end",
    range_middle: "range-middle",
    range_start: "range-start",
    today:
      "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-1 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors",
    week_number:
      "size-(--cell-size) p-0 text-xs font-medium text-muted-foreground/72",
    weekday:
      "size-(--cell-size) p-0 text-xs font-medium text-muted-foreground/72",
  };

  const mergedClassNames: typeof defaultClassNames = Object.keys(
    defaultClassNames,
  ).reduce(
    (acc, key) => {
      const userClass = classNames?.[key as keyof typeof classNames];
      const baseClass =
        defaultClassNames[key as keyof typeof defaultClassNames];

      acc[key as keyof typeof defaultClassNames] = userClass
        ? cn(baseClass, userClass)
        : baseClass;

      return acc;
    },
    { ...defaultClassNames } as typeof defaultClassNames,
  );

  return (
    <DayPicker
      data-slot="calendar"
      locale={locale}
      captionLayout={captionLayout}
      showOutsideDays={showOutsideDays}
      formatters={{
        formatMonthDropdown: (date) => formatLocalizedDate(date, "MMM"),
        formatWeekdayName: (date) => formatLocalizedDate(date, "EEEEEE"),
        ...formatters,
      }}
      className={cn(
        "group/calendar w-fit [--cell-size:--spacing(8)]",
        className,
      )}
      classNames={mergedClassNames}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeftIcon
              : orientation === "right"
                ? ChevronRightIcon
                : ChevronDownIcon;

          return (
            <Icon
              className={cn(
                "size-4",
                (orientation === "left" || orientation === "right") &&
                  "rtl:rotate-180",
                className,
              )}
              {...props}
            />
          );
        },
        Dropdown: ({ options, value, onChange, "aria-label": ariaLabel }) => {
          const items =
            options?.map((option) => ({
              disabled: option.disabled,
              label: option.label,
              value: option.value.toString(),
            })) ?? [];

          const handleValueChange = (newValue: string | null) => {
            if (onChange && newValue) {
              const syntheticEvent = {
                target: { value: newValue },
              } as React.ChangeEvent<HTMLSelectElement>;
              onChange(syntheticEvent);
            }
          };

          return (
            <Select
              items={items}
              value={value?.toString()}
              onValueChange={handleValueChange}
              aria-label={ariaLabel}
            >
              <SelectTrigger className="min-w-none">
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {items.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          );
        },
        ...userComponents,
      }}
      {...props}
    />
  );
}

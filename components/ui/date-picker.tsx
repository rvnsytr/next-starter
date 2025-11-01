import { cn, formatDate } from "@/utils";
import { isSameDay } from "date-fns";
import {
  CalendarDays,
  Calendar as CalendarIcon,
  CalendarRange,
} from "lucide-react";
import { Button } from "./button";
import { Calendar, CalendarProps } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const defaultPlaceholder = "Pilih Tanggal";

export function DatePicker({
  placeholder = defaultPlaceholder,
  numberOfMonths,
  invalid,
  ...props
}: CalendarProps & { placeholder?: string; invalid?: boolean }) {
  let isSelected = false;
  let Icon = CalendarIcon;

  if (props.mode) {
    const { mode, selected } = props;

    if (mode === "single") {
      isSelected = !!selected;
      placeholder = selected
        ? formatDate(selected, "PPPP")
        : defaultPlaceholder;
    }

    if (mode === "multiple") {
      Icon = CalendarDays;
      placeholder = defaultPlaceholder;

      if (selected && selected.length > 0) {
        isSelected = true;
        const max = 1;
        const { length } = selected;
        const dates = selected.map((date) => formatDate(date, "PPP"));

        placeholder = dates.slice(0, max).join(", ");
        if (length > max) placeholder += `, dan ${length - max} lainnya`;
      }
    }

    if (mode === "range") {
      Icon = CalendarRange;
      numberOfMonths = numberOfMonths || 2;
      placeholder = "Pilih Rentang Tanggal";

      if (selected?.from) {
        isSelected = true;
        const { from, to } = selected;

        placeholder =
          to && !isSameDay(from, to)
            ? `${formatDate(from, "PPP")} - ${formatDate(to, "PPP")}`
            : formatDate(from, "PPP");
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={invalid ? "outline_destructive" : "outline"}
          className={cn(
            "justify-between",
            !isSelected && "text-muted-foreground",
            invalid && "border-destructive text-destructive",
          )}
        >
          {placeholder} <Icon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="size-fit p-0">
        <Calendar numberOfMonths={numberOfMonths} {...props} />
      </PopoverContent>
    </Popover>
  );
}
